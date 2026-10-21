from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import CandidateProfile, UserProfile

User = get_user_model()

@api_view(['POST'])
def login_api(request):
    login_id = request.data.get('username') 
    password = request.data.get('password')
    actual_username = None

    if login_id:
        user_by_email = User.objects.filter(email=login_id).first()
        if user_by_email:
            actual_username = user_by_email.username
        else:
            candidate = CandidateProfile.objects.filter(phone_number=login_id).first()
            if candidate:
                actual_username = candidate.user.username
            else:
                actual_username = login_id

    user = authenticate(username=actual_username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        if user.is_superuser:
            user_role = 'admin'
        elif hasattr(user, 'userprofile'):
            user_role = user.userprofile.role
        else:
            user_role = 'unassigned'
            
        return Response({"message": "Login successful", "token": str(refresh.access_token), "role": user_role}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid login credentials."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken! Try another."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    UserProfile.objects.create(user=user, role='unassigned')
    refresh = RefreshToken.for_user(user)
    return Response({"message": "Account created successfully!", "token": str(refresh.access_token), "role": "unassigned"}, status=status.HTTP_201_CREATED)