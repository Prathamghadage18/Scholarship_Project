from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from api.email_service import EmailService
from api.permissions import CanManageAcademicRecords, CanManageUsers, IsHQUser
from api.serializers import (
    AttendanceRecordSerializer,
    AuthUserSerializer,
    RegisterSerializer,
    SchoolTenantSerializer,
    StudentProfileSerializer,
    TeacherProfileSerializer,
    TimetableEntrySerializer,
)
from headquarters.models import User
from students.models import AttendanceRecord, StudentProfile
from teachers.models import TeacherProfile, TimetableEntry
from tenants.models import SchoolTenant


class CurrentUserView(APIView):
    def get(self, request):
        serializer = AuthUserSerializer(request.user)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(AuthUserSerializer(user).data, status=status.HTTP_201_CREATED)


class TenantViewSet(viewsets.ModelViewSet):
    queryset = SchoolTenant.objects.all().order_by("-created_at")
    serializer_class = SchoolTenantSerializer
    permission_classes = [IsHQUser]
    http_method_names = ["get", "post", "head", "options"]


class TenantActivationView(APIView):
    permission_classes = [IsHQUser]

    def post(self, request, tenant_id):
        try:
            tenant = SchoolTenant.objects.get(id=tenant_id)
            new_status = request.data.get("is_active")
            
            if new_status is None:
                return Response(
                    {"error": "is_active field is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            tenant.is_active = new_status
            tenant.save()
            
            return Response({
                "message": f"Tenant {'activated' if new_status else 'deactivated'} successfully",
                "tenant_id": tenant.id,
                "is_active": tenant.is_active
            }, status=status.HTTP_200_OK)
            
        except SchoolTenant.DoesNotExist:
            return Response(
                {"error": "Tenant not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TenantDeletionView(APIView):
    permission_classes = [IsHQUser]

    def delete(self, request, tenant_id):
        from django.db import transaction
        from django.conf import settings
        from django.contrib.auth import get_user_model
        import logging
        
        logger = logging.getLogger(__name__)
        
        try:
            tenant = SchoolTenant.objects.get(id=tenant_id)
            confirmation = request.data.get("confirmation")
            
            # Verify confirmation matches tenant name or subdomain
            if confirmation not in [tenant.name, tenant.subdomain]:
                return Response(
                    {"error": "Confirmation must match tenant name or subdomain"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                # Delete all users associated with this tenant
                User = get_user_model()
                deleted_users = User.objects.filter(school=tenant).delete()
                
                # If multi-tenancy is enabled, drop the tenant schema
                if getattr(settings, 'USE_DJANGO_TENANTS', False):
                    from django_tenants.utils import schema_context
                    from django.db import connection
                    
                    schema_name = tenant.schema_name if hasattr(tenant, 'schema_name') else tenant.subdomain
                    
                    # Drop the schema
                    with connection.cursor() as cursor:
                        cursor.execute(f"DROP SCHEMA IF EXISTS {schema_name} CASCADE")
                    
                    logger.info(f"Dropped schema: {schema_name}")
                
                # Delete the domain record if it exists
                if getattr(settings, 'USE_DJANGO_TENANTS', False):
                    from tenants.models import Domain
                    Domain.objects.filter(tenant=tenant).delete()
                
                # Delete the tenant record
                tenant.delete()
                
                logger.info(f"Deleted tenant: {tenant.name} (ID: {tenant_id})")
                
                return Response({
                    "message": "Tenant deleted successfully",
                    "deleted_users": deleted_users[0] if deleted_users else 0
                }, status=status.HTTP_200_OK)
                
        except SchoolTenant.DoesNotExist:
            return Response(
                {"error": "Tenant not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Failed to delete tenant {tenant_id}: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentProfileSerializer
    permission_classes = [CanManageUsers]

    def get_queryset(self):
        user = self.request.user
        queryset = StudentProfile.objects.select_related("user").order_by("class_name", "section", "admission_number")
        if user.role == User.Role.STUDENT:
            return queryset.filter(user=user)
        return queryset.filter(user__school=user.school)

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        user.delete()


class TeacherViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherProfileSerializer
    permission_classes = [CanManageUsers]

    def get_queryset(self):
        user = self.request.user
        queryset = TeacherProfile.objects.select_related("user").order_by("assigned_class", "employee_id")
        if user.role == User.Role.TEACHER:
            return queryset.filter(user=user)
        return queryset.filter(user__school=user.school)

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        user.delete()


class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [CanManageAcademicRecords]

    def get_queryset(self):
        user = self.request.user
        queryset = AttendanceRecord.objects.select_related("student__user", "marked_by").order_by("-attendance_date")
        if user.role == User.Role.STUDENT:
            return queryset.filter(student__user=user)
        return queryset.filter(student__user__school=user.school)


class AttendanceSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        student_id = request.query_params.get("student_id")
        queryset = AttendanceRecord.objects.all()

        if request.user.role == User.Role.STUDENT:
            queryset = queryset.filter(student__user=request.user)
        else:
            queryset = queryset.filter(student__user__school=request.user.school)
            if student_id:
                queryset = queryset.filter(student_id=student_id)

        total = queryset.count()
        present = queryset.filter(status=AttendanceRecord.Status.PRESENT).count()
        percentage = round((present / total) * 100, 2) if total else 0
        return Response({"total": total, "present": present, "percentage": percentage})


class TimetableViewSet(viewsets.ModelViewSet):
    serializer_class = TimetableEntrySerializer
    permission_classes = [CanManageAcademicRecords]

    def get_queryset(self):
        user = self.request.user
        queryset = TimetableEntry.objects.select_related("teacher__user").order_by("day_of_week", "start_time")
        if user.role == User.Role.TEACHER:
            return queryset.filter(teacher__user=user)
        return queryset.filter(teacher__user__school=user.school)


class SendAttendanceNotificationView(APIView):
    permission_classes = [CanManageAcademicRecords]

    def post(self, request):
        student_id = request.data.get("student_id")
        date = request.data.get("date")
        status = request.data.get("status")
        
        if not all([student_id, date, status]):
            return Response(
                {"error": "student_id, date, and status are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            student = StudentProfile.objects.get(id=student_id)
            parent = student.user  # Assuming student user is the parent for now
            
            # Get parent's parent user if exists
            # For now, we'll use the student's email
            recipient_email = parent.email
            recipient_name = parent.first_name or "Parent"
            student_name = f"{parent.first_name} {parent.last_name}"
            school_name = request.user.school.name if request.user.school else "School"
            
            success = EmailService.send_attendance_email(
                student_name=student_name,
                parent_name=recipient_name,
                date=date,
                status=status,
                school_name=school_name,
                recipient_email=recipient_email,
            )
            
            if success:
                return Response(
                    {"message": "Attendance notification sent successfully"},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Failed to send attendance notification"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except StudentProfile.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SendAnnouncementNotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        title = request.data.get("title")
        description = request.data.get("description")
        link = request.data.get("link", "")
        recipient_emails = request.data.get("recipient_emails", [])
        
        if not all([title, description]):
            return Response(
                {"error": "title and description are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not recipient_emails:
            return Response(
                {"error": "At least one recipient email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        school_name = request.user.school.name if request.user.school else "School"
        
        success_count = 0
        failed_count = 0
        
        for email in recipient_emails:
            recipient_name = email.split("@")[0]  # Use email username as name
            success = EmailService.send_announcement_email(
                recipient_name=recipient_name,
                school_name=school_name,
                title=title,
                description=description,
                link=link,
                recipient_email=email,
            )
            if success:
                success_count += 1
            else:
                failed_count += 1
        
        return Response({
            "message": f"Sent {success_count} announcements successfully",
            "success_count": success_count,
            "failed_count": failed_count,
        }, status=status.HTTP_200_OK)
