# accounts/urls.py
from django.urls import path
from .views.auth_views import login_api, register_api
from .views.dashboard_views import get_admin_dashboard_data, admin_staff_list_api, admin_create_staff_api
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
    

]