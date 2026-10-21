from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # അഡ്മിൻ പാനലിൽ ലിസ്റ്റ് ചെയ്യേണ്ട കാര്യങ്ങൾ
    list_display = ['username', 'email', 'phone_number', 'is_paid', 'is_staff']
    
    # യൂസറെ എഡിറ്റ് ചെയ്യുമ്പോൾ ഈ ഫീൽഡുകൾ കൂടി കാണിക്കാൻ
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone_number', 'is_paid')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)