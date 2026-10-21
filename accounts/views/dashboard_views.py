from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from accounts.models import UserProfile

from jobs.models import Job 

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_admin_dashboard_data(request):
    # 1. Active jobs count edukkaan
    active_jobs_count = Job.objects.filter(approval_status='Approved', is_active=True).count()
    
    # 2. Pending aayi kidakkunna jobs edukkaan
    pending_jobs = Job.objects.filter(approval_status='Pending').order_by('-created_at')
    
    # Pending jobs-ne oru list aayi mattunnu (React-il kaanikkan vendi)
    pending_jobs_data = []
    for job in pending_jobs:
        pending_jobs_data.append({
            "id": job.id,
            "title": job.title,
            "company_name": job.company_name,
            "location": job.location,
            "job_type": job.job_type,
            # Aavashyamenkil created_at koodi add cheyyam
        })

    data = {
        "welcome_message": f"Hello {request.user.username}, welcome to your secure dashboard!",
        "total_staffs": UserProfile.objects.filter(role='staff').count(),
        
        # Puthiyathayi add cheythathu
        "active_jobs": active_jobs_count, 
        "pending_jobs": pending_jobs_data, 
        
        "recent_activities": ["Platform operating normally."]
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_staff_list_api(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role != 'admin' and not request.user.is_superuser:
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    staff_profiles = UserProfile.objects.filter(role='staff').select_related('user')
    staff_data = [{"username": sp.user.username, "email": sp.user.email} for sp in staff_profiles]
    return Response(staff_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_staff_api(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role != 'admin' and not request.user.is_superuser:
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    username = request.data.get('username')
    email = request.data.get('email', '')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Fields missing"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    UserProfile.objects.create(user=user, role='staff')
    return Response({"message": "Staff created!"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_dashboard_data(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
        # സ്റ്റാഫിന് മാത്രമാണ് ഈ ഡാറ്റ കൊടുക്കുന്നത്
        if profile.role not in ['staff', 'admin']:
            return Response({"error": "Permission denied"}, status=403)
            
        # എത്ര ജോബുകൾ അപ്രൂവ് ചെയ്യാൻ ബാക്കിയുണ്ടെന്ന് എണ്ണുന്നു
        pending_jobs_count = Job.objects.filter(approval_status='Pending').count()
        
        data = {
            "welcome_message": f"Welcome back, {request.user.username}!",
            "pending_tasks": pending_jobs_count
        }
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

