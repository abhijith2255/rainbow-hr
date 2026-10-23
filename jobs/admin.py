from django.contrib import admin

from jobs.models import Category, Job

# Register your models here.
admin.site.register(Category)
admin.site.register(Job)