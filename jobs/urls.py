from django.urls import path
from . import views

urlpatterns = [
    # Jobs & Categories
    path('', views.job_list_create_api, name='job-list-create'),
    path('<int:pk>/', views.job_detail_api, name='job-detail'),
    path('<int:pk>/approve/', views.staff_approve_job_api, name='staff-approve-job'),
    path('<int:pk>/toggle-active/', views.toggle_job_active_api, name='toggle-job-active'),
    path('categories/', views.category_list_create_api, name='category-list-create'),
    path('categories/<int:pk>/', views.category_detail_api, name='category-detail'),

    # Candidate Application Endpoints
    path('<int:job_id>/apply/', views.apply_job_api, name='apply-job'),
    path('my-applications/', views.my_applications_api, name='my-applications'),
    path('applications/<int:pk>/', views.candidate_application_detail_api, name='candidate-application-detail'),

    # Staff / Admin Verification Endpoints
    path('staff/applications/', views.staff_all_applications_api, name='staff-all-applications'),
    path('staff/applications/<int:pk>/verify/', views.staff_verify_application_api, name='staff-verify-application'),
    # Staff സ്വയം പോസ്റ്റ് ചെയ്ത ജോബുകൾക്ക് വന്ന അപേക്ഷകൾ
    path('staff/posted-jobs/applications/', views.staff_posted_job_applications_api, name='staff-posted-job-applications'),

    # Employer Application Endpoint
    path('employer/applications/', views.employer_job_applications_api, name='employer-applications'),
    # Employer ATS Pipeline stage move
    path('employer/applications/<int:pk>/stage/', views.move_application_stage_api, name='move-application-stage'),
    # Employer Job Analytics
    path('employer/analytics/', views.employer_job_analytics_api, name='employer-job-analytics'),
    # Employer ATS Pipeline-യിലെ ജോബ് ലിസ്റ്റ്
    path('employer/pipeline/jobs/', views.employer_pipeline_jobs_api, name='employer-pipeline-jobs'),

    # Candidate: Saved / Bookmarked Jobs
    path('saved-jobs/', views.saved_jobs_api, name='saved-jobs'),
    path('<int:pk>/save/', views.toggle_save_job_api, name='toggle-save-job'),

    # Job Analytics: view tracking
    path('<int:pk>/view/', views.track_job_view_api, name='track-job-view'),

    # Employer ATS Pipeline (ഒരു ജോബിന്റെ Kanban)
    path('<int:pk>/pipeline/', views.job_pipeline_api, name='job-pipeline'),
]