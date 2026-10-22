"""
User upload ചെയ്യുന്ന ഫയലുകൾക്ക് (resume, company logo, profile picture) വേണ്ട
പൊതുവായ validation helpers.

Extension + MIME type + file size എന്നിവ പരിശോധിക്കുന്നു.
Invalid ആണെങ്കിൽ DRF-ന്റെ ValidationError (HTTP 400) ഉയർത്തുന്നു.
"""
import os
from rest_framework.exceptions import ValidationError

# --- Resume (PDF / DOC / DOCX) ---
ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx']
ALLOWED_RESUME_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
MAX_RESUME_SIZE_MB = 5

# --- Images (Company logo / Profile picture) ---
ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
MAX_IMAGE_SIZE_MB = 2

# ചില ബ്രൗസറുകൾ ശരിയായ content-type അയക്കാതിരിക്കുമ്പോൾ ഇത് അവഗണിക്കുന്നു
UNKNOWN_MIME_TYPES = ['application/octet-stream', '']


def validate_resume_file(file_obj):
    """Resume PDF/DOC/DOCX മാത്രം, പരമാവധി 5 MB."""
    if not file_obj:
        return

    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext not in ALLOWED_RESUME_EXTENSIONS:
        raise ValidationError({
            "error": f"Invalid resume format '{ext or 'unknown'}'. "
                     f"Allowed formats: {', '.join(ALLOWED_RESUME_EXTENSIONS)}"
        })

    content_type = getattr(file_obj, 'content_type', None)
    if content_type and content_type not in UNKNOWN_MIME_TYPES and content_type not in ALLOWED_RESUME_MIME_TYPES:
        raise ValidationError({
            "error": f"Invalid resume content type '{content_type}'."
        })

    if file_obj.size > MAX_RESUME_SIZE_MB * 1024 * 1024:
        raise ValidationError({
            "error": f"Resume size must not exceed {MAX_RESUME_SIZE_MB} MB."
        })


def validate_image_file(file_obj, label="image"):
    """Company logo / profile picture: JPG, PNG, WEBP മാത്രം, പരമാവധി 2 MB."""
    if not file_obj:
        return

    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError({
            "error": f"Invalid {label} format '{ext or 'unknown'}'. "
                     f"Allowed formats: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        })

    content_type = getattr(file_obj, 'content_type', None)
    if content_type and content_type not in UNKNOWN_MIME_TYPES and content_type not in ALLOWED_IMAGE_MIME_TYPES:
        raise ValidationError({
            "error": f"Invalid {label} content type '{content_type}'."
        })

    if file_obj.size > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise ValidationError({
            "error": f"{label.capitalize()} size must not exceed {MAX_IMAGE_SIZE_MB} MB."
        })
