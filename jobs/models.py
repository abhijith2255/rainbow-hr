from django.db import models
from django.conf import settings

# 1. Category Model
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=100, blank=True, null=True, help_text="React Icon name (e.g., 'FaCode', 'Briefcase')")
    
    def __str__(self):
        return self.name

# 2. Main Job Model
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
    
    # Category Relation
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')
    
    job_type = models.CharField(max_length=50, choices=JOB_TYPES, default='Full-time')
    gender_preference = models.CharField(max_length=20, choices=GENDER_PREFERENCES, default='Any')
    salary_type = models.CharField(max_length=50, choices=SALARY_TYPES, default='Fixed Range')
    salary_range = models.CharField(max_length=100, blank=True, null=True)
    has_incentives = models.BooleanField(default=False)
    incentive_details = models.CharField(max_length=255, blank=True, null=True)

    # Requirements & Eligibility
    fresher_allowed = models.BooleanField(default=True)
    experience_required = models.CharField(max_length=100, blank=True, null=True)
    age_limit = models.CharField(max_length=100, blank=True, null=True)
    qualification = models.CharField(max_length=255, blank=True, null=True)

    # Perks & Benefits
    accommodation = models.BooleanField(default=False)
    food_provided = models.BooleanField(default=False)
    health_insurance = models.BooleanField(default=False)
    provident_fund = models.BooleanField(default=False)
    travel_allowance = models.BooleanField(default=False)
    dearness_allowance = models.BooleanField(default=False)
    leave_policy = models.CharField(max_length=255, blank=True, null=True)
    additional_benefits = models.TextField(blank=True, null=True)

    description = models.TextField()
    requirements = models.TextField()
    
    approval_status = models.CharField(max_length=20, choices=status_choices, default='Pending')
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company_name}"

class JobApplication(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending Staff Review'),
        ('Approved', 'Approved / Forwarded to Employer'),
        ('Rejected', 'Rejected by Staff'),
    )

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_applications')
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(blank=True, null=True)
    
    # Staff / Admin Verification Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_applications')
    
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.job.title} ({self.status})"