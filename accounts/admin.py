from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile, EmployerProfile, CandidateProfile

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'phone_number', 'is_paid', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone_number', 'is_paid')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserProfile)
admin.site.register(EmployerProfile)
admin.site.register(CandidateProfile)