from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from api.views import (
    AttendanceSummaryView,
    AttendanceViewSet,
    CurrentUserView,
    RegisterView,
    SendAnnouncementNotificationView,
    SendAttendanceNotificationView,
    StudentViewSet,
    TeacherViewSet,
    TenantActivationView,
    TenantDeletionView,
    TenantViewSet,
    TimetableViewSet,
)

router = DefaultRouter()
router.register(r"tenants", TenantViewSet, basename="tenant")
router.register(r"students", StudentViewSet, basename="student")
router.register(r"teachers", TeacherViewSet, basename="teacher")
router.register(r"attendance", AttendanceViewSet, basename="attendance")
router.register(r"timetable", TimetableViewSet, basename="timetable")

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/me/", CurrentUserView.as_view(), name="me"),
    path("attendance/summary/", AttendanceSummaryView.as_view(), name="attendance-summary"),
    path("notifications/attendance/", SendAttendanceNotificationView.as_view(), name="attendance-notification"),
    path("notifications/announcement/", SendAnnouncementNotificationView.as_view(), name="announcement-notification"),
    path("tenants/<int:tenant_id>/activate/", TenantActivationView.as_view(), name="tenant-activate"),
    path("tenants/<int:tenant_id>/delete/", TenantDeletionView.as_view(), name="tenant-delete"),
    path("", include(router.urls)),
]
