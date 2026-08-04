from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponseForbidden
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class TenantStatusMiddleware(MiddlewareMixin):
    """
    Middleware to enforce tenant status checks.
    Blocks requests from inactive tenants.
    """
    
    def process_request(self, request):
        # Only check tenant status if multi-tenancy is enabled
        if not getattr(settings, 'USE_DJANGO_TENANTS', False):
            return None
        
        # Skip tenant status check for HQ users and public endpoints
        if hasattr(request, 'user') and request.user.is_authenticated:
            from headquarters.models import User
            
            # Allow HQ users regardless of tenant status
            if request.user.role == User.Role.HQ:
                return None
            
            # Check if user belongs to a tenant and if that tenant is active
            if hasattr(request.user, 'school') and request.user.school:
                if not request.user.school.is_active:
                    logger.warning(
                        f"Blocked access for user {request.user.username} "
                        f"from inactive tenant {request.user.school.name}"
                    )
                    return HttpResponseForbidden(
                        "Your school account has been deactivated. "
                        "Please contact your administrator."
                    )
        
        return None
