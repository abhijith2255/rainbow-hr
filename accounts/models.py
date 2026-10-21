from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# 1. Custom User Model (നിങ്ങൾ കൊടുത്തത്)
class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# 2. Base User Profile
class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('employer', 'Employer'),
        ('candidate', 'Candidate'),
        ('unassigned', 'Unassigned'),
    )
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='unassigned')
    is_verified_employer = models.BooleanField(default=False)
    verified_by_staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_employers')
    
    # Ee field add cheyyuka:
    is_verified_candidate = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

# 3. Candidate Model
class CandidateProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='candidate_profile')
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], blank=True, null=True)
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    is_phone_verified = models.BooleanField(default=False) 
    full_name = models.CharField(max_length=100, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    education = models.CharField(max_length=200, blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    portfolio_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Candidate: {self.full_name or self.user.username}"

# 4. Employer Model
class EmployerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=150, blank=True, null=True)
    hr_name = models.CharField(max_length=100, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    company_website = models.URLField(blank=True, null=True)
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    company_description = models.TextField(blank=True, null=True)
    company_location = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return f"Employer: {self.company_name or self.user.username}"