from rest_framework import serializers
from .models import Job, Category, JobApplication, SavedJob, Review

# 1. പുതിയ Category Serializer
# 1.puthiya Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'jobs_count']

    def get_jobs_count(self, obj):
        return obj.jobs.filter(approval_status='Approved').count()
# 2. അപ്‌ഡേറ്റ് ചെയ്ത Job Serializer
class JobSerializer(serializers.ModelSerializer):
    # ജോബ് ഡീറ്റെയിൽസ് എടുക്കുമ്പോൾ കാറ്റഗറിയുടെ പേരും കൂടെ കിട്ടാൻ ഇത് സഹായിക്കും
    category_name = serializers.CharField(source='category.name', read_only=True)
    # ജോബ് കാർഡിൽ ഇൻഡസ്ട്രി ഐക്കൺ കാണിക്കാൻ കാറ്റഗറിയുടെ Lucide icon name
    category_icon = serializers.SerializerMethodField()
    # ലോഗിൻ ചെയ്ത കാൻഡിഡേറ്റ് ഈ ജോബിന് ഇതിനകം അപേക്ഷിച്ചിട്ടുണ്ടോ എന്ന് അറിയാൻ
    has_applied = serializers.SerializerMethodField()
    # ലോഗിൻ ചെയ്ത കാൻഡിഡേറ്റ് ഈ ജോബ് ബുക്ക്മാർക്ക് ചെയ്തിട്ടുണ്ടോ എന്ന് അറിയാൻ
    is_saved = serializers.SerializerMethodField()
    # Job Analytics-ന് വേണ്ടി മൊത്തം വ്യൂ എണ്ണം
    views_count = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()
    # ജോബ് കാർഡിൽ കാണിക്കാൻ എംപ്ലോയറുടെ കമ്പനി ലോഗോ
    company_logo = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = '__all__'
        # approval_status / is_active എന്നിവ read-only ആണ്.
        # അതുകൊണ്ട് എംപ്ലോയർക്കോ കാൻഡിഡേറ്റിനോ സ്വയം ജോബ് അപ്രൂവ് ചെയ്യാൻ കഴിയില്ല.
        # അപ്രൂവൽ നടക്കേണ്ടത് staff_approve_job_api / toggle_job_active_api വഴി മാത്രമാണ്.
        read_only_fields = ['employer', 'created_at', 'approval_status', 'is_active']

    def get_category_icon(self, obj):
        # Category ഇല്ലാത്ത ജോബുകൾക്ക് None (frontend generic icon കാണിക്കും)
        return obj.category.icon if obj.category else None

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return JobApplication.objects.filter(job=obj, applicant=request.user).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(job=obj, user=request.user).exists()
        return False

    def get_views_count(self, obj):
        return obj.views.count()

    def get_applications_count(self, obj):
        return obj.applications.count()

    def get_company_logo(self, obj):
        # EmployerProfile ഇല്ലാത്ത അവസരത്തിലും ലോഗോ അപ്‌ലോഡ് ചെയ്യാത്ത അവസരത്തിലും
        # crash ആകാതെ None തിരികെ നൽകുന്നു (frontend-ൽ icon fallback കാണിക്കും).
        profile = getattr(obj.employer, 'employer_profile', None)
        logo = getattr(profile, 'company_logo', None)
        if not logo:
            return None
        try:
            url = logo.url
        except ValueError:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(url) if request else url


class SavedJobSerializer(serializers.ModelSerializer):
    """ബുക്ക്മാർക്ക് ചെയ്ത ജോബുകൾ കാൻഡിഡേറ്റിന് കാണിക്കാൻ"""
    job_details = serializers.SerializerMethodField()

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'job_details', 'created_at']

    def get_job_details(self, obj):
        request = self.context.get('request')
        return JobSerializer(obj.job, context={'request': request}).data


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company_name', read_only=True)
    location = serializers.CharField(source='job.location', read_only=True)
    job_type = serializers.CharField(source='job.job_type', read_only=True)
    salary_range = serializers.CharField(source='job.salary_range', read_only=True)
    description = serializers.CharField(source='job.description', read_only=True)
    requirements = serializers.CharField(source='job.requirements', read_only=True)
    applicant_username = serializers.CharField(source='applicant.username', read_only=True)
    # അപേക്ഷയുടെ ഘട്ടങ്ങൾ (Timeline) കാൻഡിഡേറ്റിന് കാണിക്കാൻ
    timeline = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'location', 
            'job_type', 'salary_range', 'description', 'requirements',
            'full_name', 'email', 'phone', 'resume', 'cover_letter', 
            'status', # <-- Ee field koodi add cheyyuka
            'pipeline_stage', 'stage_updated_at', 'timeline',
            'applicant_username',
            'applied_at'
        ]
        # pipeline_stage / stage_updated_at എംപ്ലോയർക്ക് മാത്രം മാറ്റാവുന്നതാണ്
        # (move_application_stage_api വഴി). അതിനാൽ read-only ആക്കുന്നു.
        read_only_fields = ['id', 'job', 'applied_at', 'status', 'pipeline_stage', 'stage_updated_at']

    def get_timeline(self, obj):
        """Applied -> Under Review -> Shortlisted -> (Hired / Rejected) എന്ന ഘട്ടങ്ങൾ."""
        steps = ['Applied', 'Under Review', 'Shortlisted']
        order = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired']

        forwarded = obj.status == 'Approved'
        rejected = obj.status == 'Rejected' or obj.pipeline_stage == 'Rejected'
        hired = obj.pipeline_stage == 'Hired'

        try:
            current_index = order.index(obj.pipeline_stage)
        except ValueError:
            current_index = 0
        if forwarded and obj.pipeline_stage == 'Applied':
            current_index = max(current_index, 1)
        if not forwarded and obj.status == 'Pending':
            current_index = 0

        timeline = []
        for i, step in enumerate(steps):
            if rejected and i == len(steps) - 1:
                state = 'rejected'
            elif i < current_index:
                state = 'completed'
            elif i == current_index:
                state = 'current'
            else:
                state = 'pending'
            timeline.append({
                'stage': step,
                'state': state,
                'date': obj.applied_at if step == 'Applied' else (obj.stage_updated_at if state in ('current', 'completed') else None),
            })

        # അവസാന ഘട്ടം - Hired അല്ലെങ്കിൽ Rejected
        if hired:
            timeline.append({'stage': 'Hired', 'state': 'completed', 'date': obj.stage_updated_at})
        elif rejected:
            timeline.append({'stage': 'Rejected', 'state': 'current', 'date': obj.stage_updated_at})

        return timeline


# Platform Review / Testimonial Serializer
# Public aayi kaanikkunna fields mathram (user id leak cheyyilla).
class ReviewSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    designation = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        # user field output-il illa - POST-il request.user-il ninnu server-set cheyyunnu.
        fields = ['id', 'role', 'rating', 'comment', 'created_at', 'display_name', 'designation', 'avatar']
        read_only_fields = ['id', 'created_at']

    def get_display_name(self, obj):
        """Candidate -> full_name, Employer -> company_name, illenkil username."""
        user = obj.user
        if obj.role == 'employer':
            profile = getattr(user, 'employer_profile', None)
            if profile and profile.company_name:
                return profile.company_name
        else:
            profile = getattr(user, 'candidate_profile', None)
            if profile and profile.full_name:
                return profile.full_name
        return getattr(user, 'username', '') or 'RainbowHR User'

    def get_designation(self, obj):
        """Card-il kaanikkunna role description (e.g. 'Employer', 'Candidate')."""
        if obj.role == 'employer':
            profile = getattr(obj.user, 'employer_profile', None)
            return (profile.industry if profile and profile.industry else None) or 'Employer'
        profile = getattr(obj.user, 'candidate_profile', None)
        return (profile.designation if profile and profile.designation else None) or 'Candidate'

    def get_avatar(self, obj):
        """Profile picture / company logo undenkil absolute URL, illenkil None (frontend initials kaanikkum)."""
        if obj.role == 'employer':
            profile = getattr(obj.user, 'employer_profile', None)
            image = getattr(profile, 'company_logo', None)
        else:
            profile = getattr(obj.user, 'candidate_profile', None)
            image = getattr(profile, 'profile_picture', None)

        if not image:
            return None
        try:
            url = image.url
        except ValueError:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(url) if request else url