from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# ഇതേ ആപ്പിലെ (accounts) models.py-ൽ നിന്നും മോഡലുകൾ ഇംപോർട്ട് ചെയ്യുന്നു
from accounts.models import UserProfile, CandidateProfile, EmployerProfile

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_role_api(request):
    user = request.user
    role = request.data.get('role')
    profile_data = request.data.get('profile_data', {})

    # 1. യൂസർ നൽകിയ റോൾ വാലിഡ് ആണോ എന്ന് നോക്കുന്നു
    if role not in ['candidate', 'employer']:
        return Response({"error": "Invalid role selected"}, status=status.HTTP_400_BAD_REQUEST)

    # 2. പ്രധാന UserProfile-ൽ റോൾ അപ്ഡേറ്റ് ചെയ്യുന്നു
    user_profile, created = UserProfile.objects.get_or_create(user=user)
    user_profile.role = role
    user_profile.save()

    # 3. കാൻഡിഡേറ്റ് ആണെങ്കിൽ ആ വിവരങ്ങൾ CandidateProfile-ൽ സേവ് ചെയ്യുന്നു
    if role == 'candidate':
        candidate, _ = CandidateProfile.objects.get_or_create(user=user)
        # ലോഗിൻ ചെയ്യുമ്പോൾ കൊടുത്ത ഡാറ്റ സേവ് ചെയ്യുന്നു
        candidate.full_name = profile_data.get('fullName', candidate.full_name)
        candidate.designation = profile_data.get('designation', candidate.designation)
        candidate.location = profile_data.get('location', candidate.location)
        candidate.save()
        
    # 4. എംപ്ലോയർ ആണെങ്കിൽ ആ വിവരങ്ങൾ EmployerProfile-ൽ സേവ് ചെയ്യുന്നു
    elif role == 'employer':
        employer, _ = EmployerProfile.objects.get_or_create(user=user)
        # ലോഗിൻ ചെയ്യുമ്പോൾ കൊടുത്ത ഡാറ്റ സേവ് ചെയ്യുന്നു
        employer.company_name = profile_data.get('companyName', employer.company_name)
        employer.hr_name = profile_data.get('hrName', employer.hr_name)
        employer.industry = profile_data.get('industry', employer.industry)
        employer.save()

    return Response({
        "message": "Role and profile data saved successfully", 
        "role": role
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_candidate_dashboard(request):
    try:
        candidate, _ = CandidateProfile.objects.get_or_create(user=request.user)
        
        data = {
            "name": candidate.full_name or request.user.username,
            "designation": candidate.designation or "Job Seeker",
            "location": candidate.location or "Not specified",
            "phoneNumber": candidate.phone_number or "Not provided",
            "education": candidate.education or "No education details added",
            "experience": f"{candidate.experience_years} Years" if candidate.experience_years else "Fresher",
            
            # ഫോട്ടോയും റെസ്യൂമെയും പൂർണ്ണമായ ലിങ്ക് ആയി അയക്കാൻ:
            "profilePicture": request.build_absolute_uri(candidate.profile_picture.url) if candidate.profile_picture and candidate.profile_picture.name else None,
            "resume": request.build_absolute_uri(candidate.resume.url) if candidate.resume and candidate.resume.name else None,
            
            "applied_jobs": 0, 
            "saved_jobs": 0,
            "interviews": 0
        }
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Profile not found", "details": str(e)}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employer_dashboard(request):
    try:
        employer, created = EmployerProfile.objects.get_or_create(user=request.user)

        # ലോഗോ ഉണ്ടോ എന്ന് സുരക്ഷിതമായി ചെക്ക് ചെയ്യുന്നു
        logo_url = None
        if getattr(employer, 'company_logo', None) and hasattr(employer.company_logo, 'url'):
            logo_url = request.build_absolute_uri(employer.company_logo.url)

        # getattr ഉപയോഗിച്ച് ഡാറ്റ എടുക്കുന്നു (ഫീൽഡ് ഇല്ലെങ്കിലും കോഡ് ക്രാഷ് ആകില്ല!)
        data = {
            "companyName": getattr(employer, 'company_name', getattr(employer, 'companyName', "Your Company")),
            "hrName": getattr(employer, 'hr_name', getattr(employer, 'hrName', "Not added")), # hr_name എന്ന് മാറ്റി
            "industry": getattr(employer, 'industry', getattr(employer, 'industry_sector', "Not specified")),
            "location": getattr(employer, 'location', getattr(employer, 'companyLocation', "Add Location")),
            "companyLogo": logo_url,
            "email": request.user.email,
            "companyWebsite": getattr(employer, 'company_website', getattr(employer, 'website', '')),
            "companyDescription": getattr(employer, 'company_description', getattr(employer, 'description', '')),
            
            "active_jobs": 0, 
            "total_applicants": 0,
            "interviews_scheduled": 0
        }
        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        print("Employer Dashboard Error:", str(e)) 
        return Response({"error": "Failed to load dashboard", "details": str(e)}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_api(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)
    role = profile.role

    if request.method == 'GET':
        # Custom User ൽ username ഇല്ലെങ്കിൽ ക്രാഷ് ആകാതിരിക്കാൻ getattr ഉപയോഗിക്കുന്നു
        username = getattr(user, 'username', '')
        email = getattr(user, 'email', '')
        
        data = {"role": role, "email": email, "username": username}
        
        if role == 'candidate':
            candidate, _ = CandidateProfile.objects.get_or_create(user=user)
            data.update({
                "fullName": candidate.full_name or "",
                "designation": candidate.designation or "",
                "location": candidate.location or "",
                "phoneNumber": candidate.phone_number or "",
                "dob": candidate.dob or "",
                "gender": candidate.gender or "",
                "skills": candidate.skills or "",
                "experienceYears": candidate.experience_years or 0,
                "education": candidate.education or "",
                "portfolioLink": candidate.portfolio_link or "",
                "isPhoneVerified": candidate.is_phone_verified,
                # ഫോട്ടോ ഇല്ലെങ്കിൽ ക്രാഷ് ആകാതിരിക്കാൻ .name കൂടെ ചെക്ക് ചെയ്യുന്നു
                "profilePicture": candidate.profile_picture.url if candidate.profile_picture and candidate.profile_picture.name else None,
                "resume": candidate.resume.url if candidate.resume and candidate.resume.name else None,
            })
            
        elif role == 'employer':
            employer, _ = EmployerProfile.objects.get_or_create(user=user)
            data.update({
                "companyName": employer.company_name or "",
                "hrName": employer.hr_name or "",
                "industry": employer.industry or "",
                "companyWebsite": employer.company_website or "",
                "companyDescription": employer.company_description or "",
                "companyLocation": employer.company_location or "",
                # ലോഗോ ഇല്ലെങ്കിൽ ക്രാഷ് ആകാതിരിക്കാൻ
                "companyLogo": employer.company_logo.url if employer.company_logo and employer.company_logo.name else None,
            })
            
        return Response(data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        req_data = request.data
        
        # 1. കാൻഡിഡേറ്റ് ആണെങ്കിൽ
        if role == 'candidate':
            candidate, _ = CandidateProfile.objects.get_or_create(user=user)
            candidate.full_name = req_data.get('fullName', candidate.full_name)
            candidate.designation = req_data.get('designation', candidate.designation)
            candidate.location = req_data.get('location', candidate.location)
            candidate.phone_number = req_data.get('phoneNumber', candidate.phone_number)
            candidate.skills = req_data.get('skills', candidate.skills)
            candidate.experience_years = req_data.get('experienceYears', candidate.experience_years)
            candidate.education = req_data.get('education', candidate.education)
            candidate.portfolio_link = req_data.get('portfolioLink', candidate.portfolio_link)
            
            # ഫയലുകൾ സേവ് ചെയ്യാൻ
            if 'profilePicture' in request.FILES:
                candidate.profile_picture = request.FILES['profilePicture']
            if 'resume' in request.FILES:
                candidate.resume = request.FILES['resume']
                
            candidate.save()
            return Response({"message": "Candidate profile updated successfully"}, status=status.HTTP_200_OK)
            
        # 2. എംപ്ലോയർ ആണെങ്കിൽ
        elif role == 'employer':
            employer, _ = EmployerProfile.objects.get_or_create(user=user)
            employer.company_name = req_data.get('companyName', employer.company_name)
            employer.hr_name = req_data.get('hrName', employer.hr_name)
            employer.industry = req_data.get('industry', employer.industry)
            employer.company_website = req_data.get('companyWebsite', employer.company_website)
            employer.company_location = req_data.get('companyLocation', employer.company_location)
            employer.company_description = req_data.get('companyDescription', employer.company_description)
            
            # ലോഗോ സേവ് ചെയ്യാൻ
            if 'companyLogo' in request.FILES:
                employer.company_logo = request.FILES['companyLogo']
                
            employer.save()
            return Response({"message": "Employer profile updated successfully"}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)