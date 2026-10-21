from rest_framework import serializers
from .models import Job, Category, JobApplication

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
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['employer', 'created_at']
        
class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company_name', read_only=True)
    location = serializers.CharField(source='job.location', read_only=True)
    job_type = serializers.CharField(source='job.job_type', read_only=True)
    salary_range = serializers.CharField(source='job.salary_range', read_only=True)
    description = serializers.CharField(source='job.description', read_only=True)
    requirements = serializers.CharField(source='job.requirements', read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'location', 
            'job_type', 'salary_range', 'description', 'requirements',
            'full_name', 'email', 'phone', 'resume', 'cover_letter', 
            'status', # <-- Ee field koodi add cheyyuka
            'applied_at'
        ]
        read_only_fields = ['id', 'job', 'applied_at']