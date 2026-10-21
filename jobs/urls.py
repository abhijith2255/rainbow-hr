from django.urls import path
from . import views

urlpatterns = [
    # Jobs & Categories
    path('', views.job_list_create_api, name='job-list-create'),
    path('<int:pk>/', views.job_detail_api, name='job-detail'),
    path('<int:pk>/approve/', views.staff_approve_job_api, name='staff-approve-job'),
    path('categories/', views.category_list_create_api, name='category-list-create'),
    path('categories/<int:pk>/', views.category_detail_api, name='category-detail'),

    # Candidate Application Endpoints
    path('<int:job_id>/apply/', views.apply_job_api, name='apply-job'),
    path('my-applications/', views.my_applications_api, name='my-applications'),
    path('applications/<int:pk>/', views.candidate_application_detail_api, name='candidate-application-detail'),

    # Staff / Admin Verification Endpoints
    path('staff/applications/', views.staff_all_applications_api, name='staff-all-applications'),
    path('staff/applications/<int:pk>/verify/', views.staff_verify_application_api, name='staff-verify-application'),

    # Employer Application Endpoint
    path('employer/applications/', views.employer_job_applications_api, name='employer-applications'),
]