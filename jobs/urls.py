from django.urls import path
from . import views

urlpatterns = [
    path('', views.job_list_create_api, name='job-list-create'),
    path('<int:pk>/approve/', views.staff_approve_job_api, name='staff-approve-job'),
]