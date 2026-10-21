from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from accounts.models import UserProfile
from .models import Job, Category, JobApplication
from .serializers import JobSerializer, CategorySerializer, JobApplicationSerializer


# --- 1. JOBS LIST & CREATE ---
@api_view(['GET', 'POST'])
def job_list_create_api(request):
    if request.method == 'GET':
        # 1. Employer Dashboard-ൽ നിന്ന് സ്വന്തം ജോബുകൾ മാത്രം എടുക്കാൻ:
        if request.query_params.get('my_jobs') == 'true':
            if not request.user.is_authenticated:
                return Response([], status=status.HTTP_200_OK)
            # ലോഗിൻ ചെയ്ത എംപ്ലോയറുടെ ജോബുകൾ മാത്രം ഫിൽട്ടർ ചെയ്യുന്നു
            jobs = Job.objects.filter(employer=request.user).order_by('-created_at')
            serializer = JobSerializer(jobs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 2. Staff / Admin കാണുന്ന ജോബുകൾ
        user_profile = None
        if request.user.is_authenticated:
            user_profile, _ = UserProfile.objects.get_or_create(user=request.user)

        if request.user.is_authenticated and (request.user.is_superuser or (user_profile and user_profile.role in ['admin', 'staff'])):
            jobs = Job.objects.all().order_by('-created_at')
        else:
            # പൊതുവായി ഹോം പേജിൽ കാണിക്കുന്ന അപ്രൂവ്ഡ് ജോബുകൾ
            jobs = Job.objects.filter(approval_status='Approved', is_active=True).order_by('-created_at')

        category_id = request.query_params.get('category')
        if category_id:
            jobs = jobs.filter(category_id=category_id)

        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.role not in ['employer', 'staff', 'admin'] and not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            if profile.role in ['staff', 'admin'] or request.user.is_superuser:
                serializer.save(employer=request.user, approval_status='Approved', is_active=True)
            else:
                serializer.save(employer=request.user, approval_status='Pending', is_active=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- 2. STAFF APPROVE JOBS ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def staff_approve_job_api(request, pk):
    try:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.role not in ['staff', 'admin'] and not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        job = Job.objects.get(pk=pk)
        job.approval_status = 'Approved'
        job.is_active = True
        job.save()

        employer_profile, _ = UserProfile.objects.get_or_create(user=job.employer)
        employer_profile.is_verified_employer = True
        employer_profile.verified_by_staff = request.user
        employer_profile.save()

        return Response({"message": "Job approved!"}, status=status.HTTP_200_OK)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)


# --- 3. JOB DETAIL, EDIT, DELETE ---
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_detail_api(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.role not in ['admin', 'staff'] and job.employer != request.user and not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = JobSerializer(job, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.role not in ['admin', 'staff'] and job.employer != request.user and not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        job.delete()
        return Response({"message": "Job deleted"}, status=status.HTTP_204_NO_CONTENT)


# --- 4. CATEGORIES APIS ---
@api_view(['GET', 'POST'])
def category_list_create_api(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.role not in ['staff', 'admin'] and not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail_api(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['staff', 'admin'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        category.delete()
        return Response({"message": "Category deleted"}, status=status.HTTP_204_NO_CONTENT)


# --- 5. CANDIDATE: APPLY FOR A JOB ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job_api(request, job_id):
    try:
        job = Job.objects.get(pk=job_id, approval_status='Approved')
    except Job.DoesNotExist:
        return Response({"error": "Job not found or not approved"}, status=status.HTTP_404_NOT_FOUND)

    if JobApplication.objects.filter(job=job, applicant=request.user).exists():
        return Response({"error": "You have already applied for this job!"}, status=status.HTTP_400_BAD_REQUEST)

    full_name = request.data.get('full_name')
    email = request.data.get('email')
    phone = request.data.get('phone')
    cover_letter = request.data.get('cover_letter', '')
    resume = request.FILES.get('resume')

    if not resume:
        return Response({"error": "Resume file is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Candidate profile verify aano ennu check cheyyunnu
    applicant_profile, _ = UserProfile.objects.get_or_create(user=request.user)
    is_verified = getattr(applicant_profile, 'is_verified_candidate', False)

    # Orickal staff verify cheythathaanel direct Approved aayi employer-kku kaanam
    # Allengil Pending aayi staff review-kku nilkkum
    initial_status = 'Approved' if is_verified else 'Pending'

    application = JobApplication.objects.create(
        job=job,
        applicant=request.user,
        full_name=full_name,
        email=email,
        phone=phone,
        resume=resume,
        cover_letter=cover_letter,
        status=initial_status
    )

    return Response({
        "message": "Application submitted successfully!",
        "status": initial_status
    }, status=status.HTTP_201_CREATED)


# --- 6. CANDIDATE: MY APPLICATIONS ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications_api(request):
    applications = JobApplication.objects.filter(applicant=request.user).order_by('-applied_at')
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def candidate_application_detail_api(request, pk):
    try:
        application = JobApplication.objects.get(pk=pk, applicant=request.user)
    except JobApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = JobApplicationSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        application.delete()
        return Response({"message": "Application withdrawn successfully"}, status=status.HTTP_200_OK)


# --- 7. STAFF / ADMIN: ALL APPLICATIONS VIEW & VERIFICATION ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_all_applications_api(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['staff', 'admin'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    status_filter = request.query_params.get('status')
    applications = JobApplication.objects.all().order_by('-applied_at')
    
    if status_filter:
        applications = applications.filter(status=status_filter)

    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def staff_verify_application_api(request, pk):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['staff', 'admin'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    try:
        application = JobApplication.objects.get(pk=pk)
    except JobApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action') # 'approve' or 'reject'

    if action == 'approve':
        application.status = 'Approved'
        application.verified_by = request.user
        application.save()

        # Candidate-ne permanent aayi verified aakki save cheyyunnu
        candidate_profile, _ = UserProfile.objects.get_or_create(user=application.applicant)
        candidate_profile.is_verified_candidate = True
        candidate_profile.save()

        return Response({"message": "Application approved & candidate verified successfully!"}, status=status.HTTP_200_OK)
    elif action == 'reject':
        application.status = 'Rejected'
        application.verified_by = request.user
        application.save()
        return Response({"message": "Application rejected."}, status=status.HTTP_200_OK)

    return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)


# --- 8. EMPLOYER: VIEW RECEIVED APPLICATIONS ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employer_job_applications_api(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role != 'employer':
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # സ്റ്റാഫ് സ്ഥിരീകരിച്ച Approved അപേക്ഷകൾ മാത്രം എംപ്ലോയർക്ക് ലഭ്യമാക്കുന്നു
    applications = JobApplication.objects.filter(
        job__employer=request.user, 
        status='Approved'
    ).order_by('-applied_at')

    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)