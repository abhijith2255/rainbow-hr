from django.urls import path
from .views.auth_views import login_api, register_api
# താഴത്തെ വരിയിൽ staff_dashboard_data എന്നത് പുതുതായി ആഡ് ചെയ്തു
from .views.dashboard_views import (
    get_admin_dashboard_data,
    admin_staff_list_api,
    admin_create_staff_api,
    staff_dashboard_data,
    moderation_audit_logs_api,
    admin_employers_list_api,
    admin_candidates_list_api,
    admin_verify_employer_api,
    staff_activity_api,
)
from .views.profile_views import set_role_api, get_candidate_dashboard, get_employer_dashboard, profile_api

urlpatterns = [
    path('login/', login_api, name='login'),
    path('register/', register_api, name='register'),
    path('admin/dashboard-data/', get_admin_dashboard_data, name='admin_dashboard_data'),
    path('admin/staff-list/', admin_staff_list_api, name='admin-staff-list'),
    path('admin/create-staff/', admin_create_staff_api, name='admin-create-staff'),
    
    # Profile Views
    path('set-role/', set_role_api, name='set_role'),
    path('candidate/dashboard-data/', get_candidate_dashboard, name='candidate_dashboard'),
    path('employer/dashboard-data/', get_employer_dashboard, name='employer_dashboard'),
    path('profile/', profile_api, name='profile_api'),
    
    # Staff Dashboard (views. എന്നത് മാറ്റി)
    path('staff/dashboard-data/', staff_dashboard_data, name='staff_dashboard_data'),

    # Moderation Audit Log (Staff / Admin)
    path('moderation/audit-logs/', moderation_audit_logs_api, name='moderation-audit-logs'),

    # Admin / Staff detail pages (analytics cards-ൽ നിന്ന് navigate ചെയ്യുന്നു)
    path('admin/employers/', admin_employers_list_api, name='admin-employers-list'),
    path('admin/candidates/', admin_candidates_list_api, name='admin-candidates-list'),
    path('admin/employers/<int:user_id>/verify/', admin_verify_employer_api, name='admin-verify-employer'),
    path('staff-activity/', staff_activity_api, name='staff-activity'),
]