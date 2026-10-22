from .models import AuditLog


def log_action(actor, action, target_type=None, target_id=None, target_label=None, details=None):
    """Staff / Admin നടപടികൾ Audit Log-ൽ രേഖപ്പെടുത്തുന്നു.

    Logging പരാജയപ്പെട്ടാൽ പ്രധാന API തകരരുത് എന്നതിനാൽ exception ഒഴിവാക്കുന്നു.
    """
    try:
        AuditLog.objects.create(
            actor=actor,
            action=action,
            target_type=target_type,
            target_id=target_id,
            target_label=(target_label or '')[:255],
            details=details,
        )
    except Exception:
        pass
