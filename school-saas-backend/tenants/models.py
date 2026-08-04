from django.db import models
from django.conf import settings

# Conditionally import django-tenants models only multi-tenancy is enabled
USE_TENANTS = getattr(settings, 'USE_DJANGO_TENANTS', False)

if USE_TENANTS:
    from django_tenants.models import TenantMixin, DomainMixin
else:
    # Base classes for non-tenant mode
    class TenantMixin(models.Model):
        class Meta:
            abstract = True


class SchoolTenant(TenantMixin):
    name = models.CharField(max_length=255)
    subdomain = models.SlugField(unique=True)
    contact_email = models.EmailField()
    logo = models.ImageField(upload_to='tenant_logos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    if USE_TENANTS:
        # Required by django-tenants
        auto_create_schema = True
        auto_drop_schema = False

    def __str__(self):
        return self.name


# Only define Domain model when multi-tenancy is enabled
if USE_TENANTS:
    class Domain(DomainMixin):
        """
        Domain model for subdomain routing.
        Each tenant can have multiple domains (e.g., demo.school.com, school.com)
        Only used when USE_DJANGO_TENANTS=1
        """
        pass
