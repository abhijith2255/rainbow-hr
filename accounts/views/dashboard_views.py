from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Q, Count
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


# --- ADMIN / STAFF DETAIL PAGES (Analytics cards-ൽ നിന്ന് navigate ചെയ്യുന്ന പേജുകൾ) ---
def _absolute_media_url(request, file_field):
    """ImageField-ന്റെ പൂർണ്ണ URL തിരികെ നൽകുന്നു (ഫയൽ ഇല്ലെങ്കിൽ None)."""
    if not file_field:
        return None
    try:
        url = file_field.url
    except ValueError:
        return None
    return request.build_absolute_uri(url) if request else url


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_employers_list_api(request):
    """പ്ലാറ്റ്ഫോമിലെ എല്ലാ എംപ്ലോയർമാരുടെയും വിശദമായ ലിസ്റ്റ് (Admin / Staff)."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['admin', 'staff'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # annotate: ഓരോ എംപ്ലോയറുടെയും ജോബ് എണ്ണം ഒറ്റ query-യിൽ (N+1 ഒഴിവാക്കാൻ)
    employers = (
        UserProfile.objects.filter(role='employer')
        .select_related('user', 'user__employer_profile')
        .annotate(
            total_jobs=Count('user__jobs', distinct=True),
            active_jobs=Count(
                'user__jobs',
                filter=Q(user__jobs__approval_status='Approved', user__jobs__is_active=True),
                distinct=True,
            ),
        )
        .order_by('-user__date_joined')
    )

    search = request.query_params.get('search')
    if search:
        employers = employers.filter(
            Q(user__username__icontains=search) |
            Q(user__email__icontains=search) |
            Q(user__employer_profile__company_name__icontains=search) |
            Q(user__employer_profile__industry__icontains=search)
        )

    data = []
    for ep in employers:
        emp_profile = getattr(ep.user, 'employer_profile', None)
        data.append({
            "id": ep.user.id,
            "username": ep.user.username,
            "email": ep.user.email,
            "is_active": ep.user.is_active,
            "is_verified": ep.is_verified_employer,
            "company_name": getattr(emp_profile, 'company_name', None) or ep.user.username,
            "industry": getattr(emp_profile, 'industry', None),
            "company_location": getattr(emp_profile, 'company_location', None),
            "company_website": getattr(emp_profile, 'company_website', None),
            "company_logo": _absolute_media_url(request, getattr(emp_profile, 'company_logo', None)),
            "total_jobs": ep.total_jobs,
            "active_jobs": ep.active_jobs,
        })
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_candidates_list_api(request):
    """രജിസ്റ്റർ ചെയ്ത എല്ലാ കാൻഡിഡേറ്റുകളുടെയും വിശദമായ ലിസ്റ്റ് (Admin / Staff)."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['admin', 'staff'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    candidates = (
        UserProfile.objects.filter(role='candidate')
        .select_related('user', 'user__candidate_profile')
        .annotate(total_applications=Count('user__job_applications', distinct=True))
        .order_by('-user__date_joined')
    )

    search = request.query_params.get('search')
    if search:
        candidates = candidates.filter(
            Q(user__username__icontains=search) |
            Q(user__email__icontains=search) |
            Q(user__candidate_profile__full_name__icontains=search) |
            Q(user__candidate_profile__designation__icontains=search) |
            Q(user__candidate_profile__skills__icontains=search)
        )

    data = []
    for cp in candidates:
        cand_profile = getattr(cp.user, 'candidate_profile', None)
        data.append({
            "id": cp.user.id,
            "username": cp.user.username,
            "email": cp.user.email,
            "is_verified": cp.is_verified_candidate,
            "full_name": getattr(cand_profile, 'full_name', None) or cp.user.username,
            "designation": getattr(cand_profile, 'designation', None),
            "location": getattr(cand_profile, 'location', None),
            "skills": getattr(cand_profile, 'skills', None),
            "experience_years": getattr(cand_profile, 'experience_years', 0),
            "education": getattr(cand_profile, 'education', None),
            "total_applications": cp.total_applications,
        })
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_verify_employer_api(request, user_id):
    """ഒരു എംപ്ലോയറെ verify / unverify ചെയ്യാൻ (Admin / Staff)."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['admin', 'staff'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    try:
        employer_profile = UserProfile.objects.select_related('user').get(user_id=user_id, role='employer')
    except UserProfile.DoesNotExist:
        return Response({"error": "Employer not found"}, status=status.HTTP_404_NOT_FOUND)

    # verified എന്ന value വന്നില്ലെങ്കിൽ നിലവിലെ status മാറ്റുന്നു (toggle)
    verified = request.data.get('verified')
    new_state = (not employer_profile.is_verified_employer) if verified is None else bool(verified)

    employer_profile.is_verified_employer = new_state
    employer_profile.verified_by_staff = request.user if new_state else None
    employer_profile.save()

    log_action(
        actor=request.user,
        action='employer_verify',
        target_type='employer',
        target_id=user_id,
        target_label=employer_profile.user.username,
        details=f"Employer {'verified' if new_state else 'unverified'} by {request.user.username}",
    )
    return Response({
        "message": f"Employer {'verified' if new_state else 'unverified'} successfully.",
        "is_verified": new_state,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_activity_api(request):
    """Admin-ന് ഓരോ staff-ന്റെയും moderation activity-യുടെ സംഗ്രഹം + വിശദമായ ലോഗ്."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if profile.role not in ['admin', 'staff'] and not request.user.is_superuser:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # 1. Per-staff summary (ആരാണ് എത്ര നടപടികൾ എടുത്തത്)
    staff_profiles = (
        UserProfile.objects.filter(role__in=['staff', 'admin'])
        .select_related('user')
        .order_by('user__username')
    )
    staff_summary = []
    for sp in staff_profiles:
        actor_logs = AuditLog.objects.filter(actor=sp.user)
        last_log = actor_logs.first()  # Meta.ordering = ['-created_at']
        staff_summary.append({
            "id": sp.user.id,
            "username": sp.user.username,
            "email": sp.user.email,
            "role": sp.role,
            "total_actions": actor_logs.count(),
            "job_approvals": actor_logs.filter(action='job_approve').count(),
            "application_decisions": actor_logs.filter(
                action__in=['application_approve', 'application_reject']
            ).count(),
            "category_actions": actor_logs.filter(
                action__in=['category_create', 'category_update', 'category_delete']
            ).count(),
            "last_active": last_log.created_at if last_log else None,
        })
    # ഏറ്റവും കൂടുതൽ നടപടികൾ എടുത്തവർ ആദ്യം
    staff_summary.sort(key=lambda s: s['total_actions'], reverse=True)

    # 2. വിശദമായ ലോഗ് ഫീഡ് (ഫിൽട്ടറുകൾ സഹിതം)
    logs = AuditLog.objects.select_related('actor').all()

    actor_filter = request.query_params.get('actor')
    if actor_filter:
        logs = logs.filter(actor__username=actor_filter)

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

    try:
        limit = int(request.query_params.get('limit', 200))
    except (TypeError, ValueError):
        limit = 200
    logs = logs[:max(1, min(limit, 500))]

    action_labels = dict(AuditLog.ACTION_CHOICES)
    log_data = []
    for log in logs:
        log_data.append({
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

    return Response({"staff_summary": staff_summary, "logs": log_data}, status=status.HTTP_200_OK)

