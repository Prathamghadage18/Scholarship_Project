from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

from api.urls import urlpatterns as api_urlpatterns
from academics.urls import urlpatterns as academics_urlpatterns


def health_check(request):
    return JsonResponse({"status": "ok", "service": "school-saas-backend"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check),
    path("api/", include(api_urlpatterns)),
    path("api/academics/", include(academics_urlpatterns)),
]
