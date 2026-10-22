from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta

from accounts.models import UserProfile
from accounts.audit import log_action
from .models import Job, Category, JobApplication, SavedJob, JobView
from .serializers import JobSerializer, CategorySerializer, JobApplicationSerializer, SavedJobSerializer
from .validators import validate_resume_file


# --- 1. JOBS LIST & CREATE ---
# GET പബ്ലിക് ആണ് (ഹോം പേജ് / ജോബ് ലിസ്റ്റിംഗ്). POST-ന് ഉള്ളിൽ ലോഗിൻ ചെക്ക് ഉണ്ട്.
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def job_list_create_api(request):
    if request.method == 'GET':
        # 0. Home Page-ന് വേണ്ടി: അപ്രൂവ് ചെയ്ത ജോബുകൾ മാത്രം (Employer + Staff പോസ്റ്റ് ചെയ്തത്)
        #    Role പരിഗണിക്കാതെ എപ്പോഴും Approved + Active ജോബുകൾ മാത്രം നൽകുന്നു
        if request.query_params.get('public') == 'true':
            # select_related: company_logo-ന് വേണ്ടി employer profile ഒറ്റ query-യിൽ എടുക്കുന്നു
            jobs = Job.objects.filter(approval_status='Approved', is_active=True).select_related('employer__employer_profile', 'category').order_by('-created_at')
            category_id = request.query_params.get('category')
            if category_id:
                jobs = jobs.filter(category_id=category_id)
            # request context കൊടുക്കുന്നതിലൂടെ has_applied കൃത്യമായി ലഭിക്കും
            serializer = JobSerializer(jobs, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 1. Employer Dashboard-ൽ നിന്ന് സ്വന്തം ജോബുകൾ മാത്രം എടുക്കാൻ:
        if request.query_params.get('my_jobs') == 'true':
            if not request.user.is_authenticated:
                return Response([], status=status.HTTP_200_OK)
            # ലോഗിൻ ചെയ്ത എംപ്ലോയറുടെ ജോബുകൾ മാത്രം ഫിൽട്ടർ ചെയ്യുന്നു
            jobs = Job.objects.filter(employer=request.user).select_related('employer__employer_profile', 'category').order_by('-created_at')
            serializer = JobSerializer(jobs, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 2. Staff / Admin കാണുന്ന ജോബുകൾ
        user_profile = None
        if request.user.is_authenticated:
            user_profile, _ = UserProfile.objects.get_or_create(user=request.user)

        if request.user.is_authenticated and (request.user.is_superuser or (user_profile and user_profile.role in ['admin', 'staff'])):
            jobs = Job.objects.all().select_related('employer__employer_profile', 'category').order_by('-created_at')
        else:
            # പൊതുവായി ഹോം പേജിൽ കാണിക്കുന്ന അപ്രൂവ്ഡ് ജോബുകൾ
            jobs = Job.objects.filter(approval_status='Approved', is_active=True).select_related('employer__employer_profile', 'category').order_by('-created_at')

        category_id = request.query_params.get('category')
        if category_id:
            jobs = jobs.filter(category_id=category_id)

        serializer = JobSerializer(jobs, many=True, context={'request': request})
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

        # Audit Log: ജോബ് അപ്രൂവൽ രേഖപ്പെടുത്തുന്നു
        log_action(
            actor=request.user,
            action='job_approve',
            target_type='job',
            target_id=job.id,
            target_label=f"{job.title} @ {job.company_name}",
            details=f"Job approved and activated. Employer: {job.employer.username}",
        )

        return Response({"message": "Job approved!"}, status=status.HTTP_200_OK)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)


# --- 3. JOB DETAIL, EDIT, DELETE ---
# GET പബ്ലിക് ആണ് (Job Details പേജ്). PUT / DELETE-ന് ഉള്ളിൽ ലോഗിൻ + ഉടമസ്ഥാവകാശ ചെക്ക് ഉണ്ട്.
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def job_detail_api(request, pk):
    try:
        job = Job.objects.select_related('employer__employer_profile', 'category').get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    # GET സാധാരണ ഉപയോക്താക്കൾക്കും (Job Details പേജ് പബ്ലിക് ആണ്)
    if request.method == 'GET':
        serializer = JobSerializer(job, context={'request': request})
        return Response(serializer.data)

    # PUT / DELETE ചെയ്യാൻ ലോഗിൻ നിർബന്ധമാണ്
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['admin', 'staff'] and job.employer != request.user and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Audit Log: ജോബ് എഡിറ്റ്
            log_action(
                actor=request.user,
                action='job_update',
                target_type='job',
                target_id=job.id,
                target_label=f"{job.title} @ {job.company_name}",
                details=f"Job details updated by {profile.role}.",
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    log_action(
        actor=request.user,
        action='job_delete',
        target_type='job',
        target_id=job.id,
        target_label=f"{job.title} @ {job.company_name}",
        details=f"Job deleted by {profile.role}.",
    )
    job.delete()
    return Response({"message": "Job deleted"}, status=status.HTTP_204_NO_CONTENT)


# --- 4. CATEGORIES APIS ---
# GET പബ്ലിക് ആണ് (കാറ്റഗറി ലിസ്റ്റിംഗ്). POST-ന് ഉള്ളിൽ staff/admin ചെക്ക് ഉണ്ട്.
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
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
            category = serializer.save()
            log_action(
                actor=request.user,
                action='category_create',
                target_type='category',
                target_id=category.id,
                target_label=category.name,
                details=f"Category '{category.name}' created.",
            )
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
            log_action(
                actor=request.user,
                action='category_update',
                target_type='category',
                target_id=category.id,
                target_label=category.name,
                details=f"Category '{category.name}' updated.",
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        label = category.name
        cat_id = category.id
        log_action(
            actor=request.user,
            action='category_delete',
            target_type='category',
            target_id=cat_id,
            target_label=label,
            details=f"Category '{label}' deleted.",
        )
        category.delete()
        return Response({"message": "Category deleted"}, status=status.HTTP_204_NO_CONTENT)


# --- 5. CANDIDATE: APPLY FOR A JOB ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job_api(request, job_id):
    # കാൻഡിഡേറ്റിന് മാത്രമേ അപ്ലൈ ചെയ്യാൻ അനുവാദമുള്ളൂ (employer/staff/admin അല്ല)
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role != 'candidate' and not request.user.is_superuser:
        return Response(
            {"error": "Only candidates can apply for jobs."},
            status=status.HTTP_403_FORBIDDEN
        )

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

    # ഫയൽ തരം, MIME type, വലിപ്പം എന്നിവ പരിശോധിക്കുന്നു (invalid ആണെങ്കിൽ 400)
    validate_resume_file(resume)

    # Orickal staff verify cheythathaanel direct Approved aayi employer-kku kaanam
    # Allengil Pending aayi staff review-kku nilkkum
    is_verified = getattr(profile, 'is_verified_candidate', False)
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
    applications = JobApplication.objects.select_related('job').all().order_by('-applied_at')
    
    if status_filter:
        applications = applications.filter(status=status_filter)

    # Admin / Staff applications page-ലെ തിരയൽ (അപേക്ഷകന്റെ പേര് / ജോബ് / കമ്പനി)
    search = request.query_params.get('search')
    if search:
        applications = applications.filter(
            Q(full_name__icontains=search) |
            Q(email__icontains=search) |
            Q(job__title__icontains=search) |
            Q(job__company_name__icontains=search) |
            Q(applicant__username__icontains=search)
        )

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

        log_action(
            actor=request.user,
            action='application_approve',
            target_type='application',
            target_id=application.id,
            target_label=f"{application.full_name} → {application.job.title}",
            details=f"Application approved and candidate verified. Job: {application.job.title}",
        )

        return Response({"message": "Application approved & candidate verified successfully!"}, status=status.HTTP_200_OK)
    elif action == 'reject':
        application.status = 'Rejected'
        application.verified_by = request.user
        application.save()

        log_action(
            actor=request.user,
            action='application_reject',
            target_type='application',
            target_id=application.id,
            target_label=f"{application.full_name} → {application.job.title}",
            details=f"Application rejected. Job: {application.job.title}",
        )
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

    # "View Applications" ക്ലിക്ക് ചെയ്യുമ്പോൾ ഒരു നിർദ്ദിഷ്ട ജോബിന്റെ അപേക്ഷകൾ മാത്രം ഫിൽട്ടർ ചെയ്യാൻ
    job_id = request.query_params.get('job')
    if job_id:
        applications = applications.filter(job_id=job_id)

    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# --- 9. STAFF: APPLICATIONS FOR JOBS POSTED BY THE STAFF THEMSELVES ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_posted_job_applications_api(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['staff', 'admin'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # സ്റ്റാഫ്/അഡ്മിൻ സ്വയം പോസ്റ്റ് ചെയ്ത ജോബുകൾക്ക് വന്ന അപേക്ഷകൾ മാത്രം
    applications = JobApplication.objects.filter(
        job__employer=request.user
    ).order_by('-applied_at')

    # ഒരു നിർദ്ദിഷ്ട ജോബിന്റെ അപേക്ഷകൾ മാത്രം ഫിൽട്ടർ ചെയ്യാൻ
    job_id = request.query_params.get('job')
    if job_id:
        applications = applications.filter(job_id=job_id)

    status_filter = request.query_params.get('status')
    if status_filter:
        applications = applications.filter(status=status_filter)

    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# --- 10. EMPLOYER / STAFF: JOB ACTIVE / INACTIVE TOGGLE ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_job_active_api(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    is_staff_like = profile.role in ['staff', 'admin'] or request.user.is_superuser
    if not is_staff_like and job.employer != request.user:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # ജോബ് വീണ്ടും ആക്ടീവ് ആക്കാൻ സ്റ്റാഫ് അപ്രൂവൽ ആവശ്യമാണ്
    if not job.is_active and job.approval_status != 'Approved':
        return Response(
            {"error": "This job must be approved by staff before it can be activated."},
            status=status.HTTP_400_BAD_REQUEST
        )

    job.is_active = not job.is_active
    job.save()

    # Audit Log: ജോബ് ആക്ടീവ് / ഇനാക്ടീവ് മാറ്റം (staff/admin മാത്രം)
    if is_staff_like:
        log_action(
            actor=request.user,
            action='job_activate' if job.is_active else 'job_deactivate',
            target_type='job',
            target_id=job.id,
            target_label=f"{job.title} @ {job.company_name}",
            details=f"Job {'activated' if job.is_active else 'marked inactive'} by {profile.role}.",
        )

    return Response({
        "message": f"Job {'activated' if job.is_active else 'marked as inactive'} successfully.",
        "is_active": job.is_active
    }, status=status.HTTP_200_OK)


# --- 11. CANDIDATE: SAVED / BOOKMARKED JOBS ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_jobs_api(request):
    """ലോഗിൻ ചെയ്ത കാൻഡിഡേറ്റിന്റെ ബുക്ക്മാർക്ക് ചെയ്ത ജോബുകൾ"""
    saved = SavedJob.objects.filter(user=request.user).select_related('job__employer__employer_profile', 'job__category')
    serializer = SavedJobSerializer(saved, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_save_job_api(request, pk):
    """ജോബ് ബുക്ക്മാർക്ക് ചെയ്യുക / ഒഴിവാക്കുക (toggle)"""
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    saved, created = SavedJob.objects.get_or_create(user=request.user, job=job)
    if not created:
        saved.delete()
        return Response({"saved": False, "message": "Job removed from saved list."}, status=status.HTTP_200_OK)

    return Response({"saved": True, "message": "Job saved successfully."}, status=status.HTTP_201_CREATED)


# --- 12. JOB ANALYTICS: VIEW TRACKING ---
@api_view(['POST'])
@permission_classes([AllowAny])
def track_job_view_api(request, pk):
    """Job Details പേജ് കാണുമ്പോൾ ഒരു വ്യൂ രേഖപ്പെടുത്തുന്നു (Job Analytics-ന്)."""
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user if request.user.is_authenticated else None
    # ഒരാൾ തന്നെ ഒരേ ജോബ് 30 മിനിറ്റിനുള്ളിൽ ആവർത്തിച്ച് കണ്ടാൽ ഒരിക്കൽ മാത്രം എണ്ണുന്നു
    recent_cutoff = timezone.now() - timedelta(minutes=30)
    already = JobView.objects.filter(job=job, created_at__gte=recent_cutoff)
    already = already.filter(user=user) if user else already.filter(user__isnull=True)

    if not already.exists():
        JobView.objects.create(job=job, user=user)

    return Response({"views_count": job.views.count()}, status=status.HTTP_200_OK)


# --- 13. EMPLOYER: ATS PIPELINE (KANBAN) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_pipeline_api(request, pk):
    """ഒരു ജോബിന്റെ അപേക്ഷകൾ ATS ഘട്ടങ്ങളനുസരിച്ച് (Kanban columns) തിരിച്ച് നൽകുന്നു."""
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    is_staff_like = profile.role in ['staff', 'admin'] or request.user.is_superuser
    if not is_staff_like and job.employer != request.user:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # സ്റ്റാഫ് അപ്രൂവ് ചെയ്ത അപേക്ഷകൾ മാത്രം എംപ്ലോയറുടെ പൈപ്പ്‌ലൈനിൽ വരുന്നു
    applications = JobApplication.objects.filter(job=job, status='Approved').order_by('-applied_at')
    serializer = JobApplicationSerializer(applications, many=True)

    columns = []
    for stage_key, stage_label in JobApplication.PIPELINE_STAGES:
        cards = [a for a in serializer.data if a.get('pipeline_stage') == stage_key]
        columns.append({
            "stage": stage_key,
            "label": stage_label,
            "count": len(cards),
            "applications": cards,
        })

    return Response({
        "job": {
            "id": job.id,
            "title": job.title,
            "company_name": job.company_name,
            "location": job.location,
        },
        "total": applications.count(),
        "columns": columns,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def move_application_stage_api(request, pk):
    """എംപ്ലോയർ ഒരു അപേക്ഷയെ മറ്റൊരു ATS ഘട്ടത്തിലേക്ക് നീക്കുന്നു."""
    try:
        application = JobApplication.objects.get(pk=pk)
    except JobApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    is_staff_like = profile.role in ['staff', 'admin'] or request.user.is_superuser
    if not is_staff_like and application.job.employer != request.user:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    new_stage = request.data.get('stage')
    valid_stages = [s[0] for s in JobApplication.PIPELINE_STAGES]
    if new_stage not in valid_stages:
        return Response(
            {"error": f"Invalid stage. Allowed: {', '.join(valid_stages)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    application.pipeline_stage = new_stage
    application.save()

    return Response({
        "message": f"Applicant moved to '{new_stage}'.",
        "application_id": application.id,
        "pipeline_stage": application.pipeline_stage,
    }, status=status.HTTP_200_OK)


# --- 14. EMPLOYER: JOB ANALYTICS (VIEWS + APPLICANT FUNNEL) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employer_job_analytics_api(request):
    """എംപ്ലോയറുടെ ജോബുകളുടെ വ്യൂ, അപേക്ഷ, ഫണൽ എന്നിവയുടെ സ്റ്റാറ്റിസ്റ്റിക്സ്."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role != 'employer' and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    jobs = Job.objects.filter(employer=request.user).order_by('-created_at')
    total_views = JobView.objects.filter(job__employer=request.user).count()

    job_rows = []
    for job in jobs:
        apps = JobApplication.objects.filter(job=job)
        approved = apps.filter(status='Approved').count()
        job_rows.append({
            "id": job.id,
            "title": job.title,
            "company_name": job.company_name,
            "approval_status": job.approval_status,
            "is_active": job.is_active,
            "created_at": job.created_at,
            "views": job.views.count(),
            "applications": apps.count(),
            "forwarded": approved,
            "pending_review": apps.filter(status='Pending').count(),
            "rejected": apps.filter(status='Rejected').count(),
            "shortlisted": apps.filter(pipeline_stage='Shortlisted').count(),
            "hired": apps.filter(pipeline_stage='Hired').count(),
        })

    # എല്ലാ ജോബുകളുടെയും ഒരുമിച്ചുള്ള ഫണൽ
    all_apps = JobApplication.objects.filter(job__employer=request.user)
    funnel = [
        {"stage": 'Viewed', "count": total_views},
        {"stage": 'Applied', "count": all_apps.count()},
        {"stage": 'Forwarded', "count": all_apps.filter(status='Approved').count()},
        {"stage": 'Shortlisted', "count": all_apps.filter(pipeline_stage='Shortlisted').count()},
        {"stage": 'Interview', "count": all_apps.filter(pipeline_stage='Interview').count()},
        {"stage": 'Hired', "count": all_apps.filter(pipeline_stage='Hired').count()},
    ]

    totals = {
        "total_jobs": jobs.count(),
        "active_jobs": jobs.filter(approval_status='Approved', is_active=True).count(),
        "total_views": total_views,
        "total_applications": all_apps.count(),
        "total_shortlisted": all_apps.filter(pipeline_stage='Shortlisted').count(),
        "total_hired": all_apps.filter(pipeline_stage='Hired').count(),
    }

    return Response({"totals": totals, "funnel": funnel, "jobs": job_rows}, status=status.HTTP_200_OK)


# --- 15. EMPLOYER: ALL JOBS PIPELINE SUMMARY (Pipeline page-ന്റെ ജോബ് സെലക്ടർ) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employer_pipeline_jobs_api(request):
    """ATS Pipeline പേജിൽ ജോബ് സെലക്ട് ചെയ്യാൻ ഉള്ള ലിസ്റ്റ് + ഓരോന്നിന്റെയും കാർഡ് എണ്ണം."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role != 'employer' and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    jobs = Job.objects.filter(employer=request.user).order_by('-created_at')
    data = []
    for job in jobs:
        approved_count = JobApplication.objects.filter(job=job, status='Approved').count()
        data.append({
            "id": job.id,
            "title": job.title,
            "company_name": job.company_name,
            "location": job.location,
            "approval_status": job.approval_status,
            "is_active": job.is_active,
            "applicants": approved_count,
        })
    return Response(data, status=status.HTTP_200_OK)