from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Q
from accounts.models import UserProfile, AuditLog
from accounts.audit import log_action

from jobs.models import Job, JobApplication

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_admin_dashboard_data(request):
    # ഈ എൻഡ്‌പോയിന്റ് admin / staff-ന് മാത്രം (platform-wide analytics ഉള്ളതിനാൽ)
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['admin', 'staff'] and not request.user.is_superuser:
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

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

    # 3. Platform-wide analytics counters (Admin/Staff dashboard cards)
    total_employers = UserProfile.objects.filter(role='employer', user__is_active=True).count()
    total_candidates = UserProfile.objects.filter(role='candidate').count()
    total_jobs = Job.objects.count()
    total_applications = JobApplication.objects.count()

    data = {
        "welcome_message": f"Hello {request.user.username}, welcome to your secure dashboard!",
        "total_staffs": UserProfile.objects.filter(role='staff').count(),
        
        # Puthiyathayi add cheythathu
        "active_jobs": active_jobs_count, 
        "pending_jobs": pending_jobs_data, 

        # Analytics summary cards
        "total_employers": total_employers,
        "total_candidates": total_candidates,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        
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
    log_action(
        actor=request.user,
        action='staff_create',
        target_type='user',
        target_id=user.id,
        target_label=username,
        details=f"New staff account created: {username} ({email or 'no email'})",
    )
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
        
        # Platform-wide analytics counters (Staff dashboard cards)
        total_employers = UserProfile.objects.filter(role='employer', user__is_active=True).count()
        total_candidates = UserProfile.objects.filter(role='candidate').count()
        total_jobs = Job.objects.count()
        total_applications = JobApplication.objects.count()
        
        data = {
            "welcome_message": f"Welcome back, {request.user.username}!",
            "pending_tasks": pending_jobs_count,

            # Analytics summary cards
            "total_employers": total_employers,
            "total_candidates": total_candidates,
            "total_jobs": total_jobs,
            "total_applications": total_applications
        }
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# --- MODERATION AUDIT LOG (Staff / Admin) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def moderation_audit_logs_api(request):
    """Staff / Admin നടത്തിയ എല്ലാ നടപടികളുടെയും ലോഗ് (ഏറ്റവും പുതിയത് ആദ്യം)."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['staff', 'admin'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    logs = AuditLog.objects.select_related('actor').all()

    # ഫിൽട്ടറുകൾ: ?action=job_approve , ?search=<keyword> , ?limit=<n>
    action_filter = request.query_params.get('action')
    if action_filter:
        logs = logs.filter(action=action_filter)

    search = request.query_params.get('search')
    if search:
        logs = logs.filter(
            Q(target_label__icontains=search) |
            Q(details__icontains=search) |
            Q(actor__username__icontains=search)
        )

    # സ്റ്റാഫിന് സ്വന്തം നടപടികൾ മാത്രം കാണാൻ ?mine=true
    if request.query_params.get('mine') == 'true':
        logs = logs.filter(actor=request.user)

    try:
        limit = int(request.query_params.get('limit', 200))
    except (TypeError, ValueError):
        limit = 200
    logs = logs[:max(1, min(limit, 500))]

    action_labels = dict(AuditLog.ACTION_CHOICES)
    data = []
    for log in logs:
        data.append({
            "id": log.id,
            "actor": log.actor.username if log.actor else "Deleted User",
            "action": log.action,
            "action_label": action_labels.get(log.action, log.action),
            "target_type": log.target_type,
            "target_id": log.target_id,
            "target_label": log.target_label,
            "details": log.details,
            "created_at": log.created_at,
        })

    summary = {
        "total": AuditLog.objects.count(),
        "job_approvals": AuditLog.objects.filter(action='job_approve').count(),
        "application_decisions": AuditLog.objects.filter(
            action__in=['application_approve', 'application_reject']
        ).count(),
        "job_visibility_changes": AuditLog.objects.filter(
            action__in=['job_activate', 'job_deactivate']
        ).count(),
    }

    return Response({"summary": summary, "logs": data}, status=status.HTTP_200_OK)

