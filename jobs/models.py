from django.db import models
from django.conf import settings

class Job(models.Model):
    JOB_TYPES = (
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Remote', 'Remote'),
        ('Work From Home', 'Work From Home'),
        ('Contract', 'Contract'),
        ('Internship', 'Internship'),
    )
    SALARY_TYPES = (
        ('Fixed Range', 'Fixed Salary Range'),
        ('Best in Industry', 'Best in Industry'),
        ('Based on Interview', 'Based on Interview'),
        ('Negotiable', 'Negotiable'),
    )
    GENDER_PREFERENCES = (
        ('Any', 'Any / Both'), ('Male', 'Male Only'), ('Female', 'Female Only'),
    )
    status_choices = (
        ('Pending', 'Pending Approval'), ('Approved', 'Approved'), ('Rejected', 'Rejected'),
    )

    employer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    job_type = models.CharField(max_length=50, choices=JOB_TYPES, default='Full-time')
    gender_preference = models.CharField(max_length=20, choices=GENDER_PREFERENCES, default='Any')
    salary_type = models.CharField(max_length=50, choices=SALARY_TYPES, default='Fixed Range')
    salary_range = models.CharField(max_length=100, blank=True, null=True)
    
    # Description & Req
    description = models.TextField()
    requirements = models.TextField()
    
    # Status
    approval_status = models.CharField(max_length=20, choices=status_choices, default='Pending')
    is_active = models.BooleanField(default=False) # Only 1 is_active field
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company_name}"