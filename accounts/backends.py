from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

UserModel = get_user_model()

class EmailPhoneUsernameAuthenticationBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # യൂസർ നൽകിയത് username, email, അതോ phone_number ആണോ എന്ന് ചെക്ക് ചെയ്യുന്നു
            user = UserModel.objects.get(
                Q(username__iexact=username) | 
                Q(email__iexact=username) | 
                Q(phone_number__iexact=username)
            )
        except UserModel.DoesNotExist:
            return None
        
        # പാസ്‌വേർഡ് ശരിയാണോ എന്ന് നോക്കുന്നു
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None