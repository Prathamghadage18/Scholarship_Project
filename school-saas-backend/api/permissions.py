from rest_framework.permissions import BasePermission


class IsHQUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "role", None) == "HQ")


class CanManageAcademicRecords(BasePermission):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return getattr(request.user, "role", None) in {"HQ", "PRINCIPAL", "TEACHER"}


class CanManageUsers(BasePermission):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return getattr(request.user, "role", None) in {"HQ", "PRINCIPAL"}
