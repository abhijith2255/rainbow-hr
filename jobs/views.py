from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Job
from accounts.models import UserProfile
from .serializers import JobSerializer

@api_view(['GET', 'POST'])
def job_list_create_api(request):
    if request.method == 'GET':
        user_profile = None
        if request.user.is_authenticated:
            user_profile, _ = UserProfile.objects.get_or_create(user=request.user)
        
        if request.user.is_authenticated and request.user.is_superuser or (user_profile and user_profile.role in ['admin', 'staff']):
            # അഡ്മിനും സ്റ്റാഫിനും എല്ലാ ജോബുകളും കിട്ടും
            jobs = Job.objects.all().order_by('-created_at')
        elif user_profile and user_profile.role == 'employer':
            # എംപ്ലോയർക്ക് അവരുടെ ജോബുകളും മറ്റു അപ്രൂവ് ആയ ജോബുകളും
            jobs = Job.objects.filter(Q(approval_status='Approved', is_active=True) | Q(employer=request.user)).order_by('-created_at')
        else:
            # ബാക്കി എല്ലാവർക്കും അപ്രൂവ് ആയ ജോബുകൾ മാത്രം
            jobs = Job.objects.filter(approval_status='Approved', is_active=True).order_by('-created_at')
            
        # ശ്രദ്ധിക്കുക: ഈ രണ്ട് വരികളും if/else ബ്ലോക്കുകൾക്ക് പുറത്താണ് കിടക്കേണ്ടത്
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