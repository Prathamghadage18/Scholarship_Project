from django.contrib.auth import get_user_model
from rest_framework import serializers

from headquarters.models import User
from students.models import AttendanceRecord, StudentProfile
from teachers.models import TeacherProfile, TimetableEntry
from tenants.models import SchoolTenant


class SchoolTenantSerializer(serializers.ModelSerializer):
    # Admin details for creating the initial principal
    admin_first_name = serializers.CharField(write_only=True, required=True)
    admin_last_name = serializers.CharField(write_only=True, required=True)
    admin_email = serializers.EmailField(write_only=True, required=True)
    admin_password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = SchoolTenant
        fields = [
            "id", "name", "subdomain", "contact_email", "logo", "is_active", "created_at",
            "admin_first_name", "admin_last_name", "admin_email", "admin_password"
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        from django.conf import settings
        from django.contrib.auth import get_user_model
        from api.email_service import EmailService
        
        # Extract admin details
        admin_first_name = validated_data.pop('admin_first_name')
        admin_last_name = validated_data.pop('admin_last_name')
        admin_email = validated_data.pop('admin_email')
        admin_password = validated_data.pop('admin_password')
        
        # Create the tenant
        tenant = SchoolTenant.objects.create(**validated_data)
        
        # Only create domain if multi-tenancy is enabled
        if getattr(settings, 'USE_DJANGO_TENANTS', False):
            from tenants.models import Domain
            
            # Get the base domain from environment or use localhost for development
            base_domain = getattr(settings, 'BASE_DOMAIN', 'localhost')
            
            # Create the subdomain (e.g., demo.localhost)
            domain = f"{tenant.subdomain}.{base_domain}"
            Domain.objects.create(
                domain=domain,
                tenant=tenant,
                is_primary=True
            )
        
        # Create the initial principal user for this tenant
        User = get_user_model()
        username = f"{tenant.subdomain}_admin"
        
        principal = User.objects.create_user(
            username=username,
            email=admin_email,
            password=admin_password,
            first_name=admin_first_name,
            last_name=admin_last_name,
            role=User.Role.PRINCIPAL,
            school=tenant
        )
        
        # Send welcome email to the new principal
        principal_full_name = f"{admin_first_name} {admin_last_name}"
        login_url = f"http://{tenant.subdomain}.localhost:5173/login"
        
        try:
            EmailService.send_welcome_email(
                principal_name=principal_full_name,
                school_name=tenant.name,
                subdomain=tenant.subdomain,
                username=username,
                recipient_email=admin_email,
            )
        except Exception as e:
            # Log error but don't fail the tenant creation if email fails
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send welcome email: {str(e)}")
        
        return tenant


class AuthUserSerializer(serializers.ModelSerializer):
    school = SchoolTenantSerializer(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "first_name", "last_name", "role", "school"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    school = serializers.PrimaryKeyRelatedField(queryset=SchoolTenant.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "role", "school"]

    def validate_role(self, value):
        if value == User.Role.HQ:
            raise serializers.ValidationError("HQ accounts cannot be created through public registration.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save(update_fields=["password"])
        return user


class StudentProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8, required=False)
    school = serializers.PrimaryKeyRelatedField(queryset=SchoolTenant.objects.all(), required=False, allow_null=True)
    school_id = serializers.IntegerField(source="user.school_id", read_only=True)
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "user_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "school",
            "school_id",
            "display_name",
            "admission_number",
            "class_name",
            "section",
            "is_active",
        ]
        read_only_fields = ["id", "user_id", "school_id", "display_name"]

    def get_display_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_admission_number(self, value):
        if StudentProfile.objects.filter(admission_number=value).exists():
            raise serializers.ValidationError("A student with this admission number already exists.")
        return value

    def _resolve_school(self, validated_data):
        request = self.context["request"]
        school = validated_data.pop("school", None)
        if request.user.role == User.Role.HQ:
            return school
        return request.user.school

    def create(self, validated_data):
        school = self._resolve_school(validated_data)
        password = validated_data.pop("password", None) or "ChangeMe123!"
        username = validated_data.pop("username")
        email = validated_data.pop("email")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name", "")
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.STUDENT,
            school=school,
            password=password,
        )
        return StudentProfile.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        user = instance.user
        for user_field in ("username", "email", "first_name", "last_name"):
            if user_field in validated_data:
                setattr(user, user_field, validated_data.pop(user_field))
        password = validated_data.pop("password", None)
        validated_data.pop("school", None)
        if password:
            user.set_password(password)
        user.save()
        return super().update(instance, validated_data)


class TeacherProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8, required=False)
    school = serializers.PrimaryKeyRelatedField(queryset=SchoolTenant.objects.all(), required=False, allow_null=True)
    school_id = serializers.IntegerField(source="user.school_id", read_only=True)
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = TeacherProfile
        fields = [
            "id",
            "user_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "school",
            "school_id",
            "display_name",
            "employee_id",
            "subject_name",
            "assigned_class",
            "is_active",
        ]
        read_only_fields = ["id", "user_id", "school_id", "display_name"]

    def get_display_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_employee_id(self, value):
        if TeacherProfile.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("A teacher with this employee ID already exists.")
        return value

    def _resolve_school(self, validated_data):
        request = self.context["request"]
        school = validated_data.pop("school", None)
        if request.user.role == User.Role.HQ:
            return school
        return request.user.school

    def create(self, validated_data):
        school = self._resolve_school(validated_data)
        password = validated_data.pop("password", None) or "ChangeMe123!"
        username = validated_data.pop("username")
        email = validated_data.pop("email")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name", "")
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.TEACHER,
            school=school,
            password=password,
        )
        return TeacherProfile.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        user = instance.user
        for user_field in ("username", "email", "first_name", "last_name"):
            if user_field in validated_data:
                setattr(user, user_field, validated_data.pop(user_field))
        password = validated_data.pop("password", None)
        validated_data.pop("school", None)
        if password:
            user.set_password(password)
        user.save()
        return super().update(instance, validated_data)


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.get_full_name", read_only=True)
    admission_number = serializers.CharField(source="student.admission_number", read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            "id",
            "student",
            "student_name",
            "admission_number",
            "attendance_date",
            "status",
            "notes",
            "marked_by",
            "created_at",
        ]
        read_only_fields = ["id", "marked_by", "created_at"]

    def create(self, validated_data):
        validated_data["marked_by"] = self.context["request"].user
        return super().create(validated_data)


class TimetableEntrySerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.user.get_full_name", read_only=True)

    class Meta:
        model = TimetableEntry
        fields = [
            "id",
            "teacher",
            "teacher_name",
            "class_name",
            "section",
            "subject_name",
            "room_name",
            "day_of_week",
            "start_time",
            "end_time",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "teacher_name"]

    def validate(self, attrs):
        start_time = attrs.get("start_time", getattr(self.instance, "start_time", None))
        end_time = attrs.get("end_time", getattr(self.instance, "end_time", None))
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError("End time must be after start time.")

        teacher = attrs.get("teacher", getattr(self.instance, "teacher", None))
        day_of_week = attrs.get("day_of_week", getattr(self.instance, "day_of_week", None))
        class_name = attrs.get("class_name", getattr(self.instance, "class_name", None))
        section = attrs.get("section", getattr(self.instance, "section", ""))
        room_name = attrs.get("room_name", getattr(self.instance, "room_name", None))

        overlapping_entries = TimetableEntry.objects.filter(day_of_week=day_of_week)
        if self.instance:
            overlapping_entries = overlapping_entries.exclude(pk=self.instance.pk)

        for entry in overlapping_entries:
            overlaps = start_time < entry.end_time and end_time > entry.start_time
            teacher_conflict = teacher and entry.teacher_id == teacher.id
            room_conflict = room_name and entry.room_name == room_name
            class_conflict = class_name and entry.class_name == class_name and entry.section == section
            if overlaps and (teacher_conflict or room_conflict or class_conflict):
                raise serializers.ValidationError(
                    "Timetable conflict detected for the selected teacher, room, or class slot."
                )
        return attrs
