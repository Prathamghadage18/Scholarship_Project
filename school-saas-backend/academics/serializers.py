from rest_framework import serializers
from academics.models import (
    Subject,
    Grade,
    ReportCard,
    AnswerSheet,
    ScholarshipExam,
    ExamParticipation,
    ExamResult,
    SchoolPerformanceMetrics,
    HQNotice,
)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name", "code", "description", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.username", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    subject_code = serializers.CharField(source="subject.code", read_only=True)

    class Meta:
        model = Grade
        fields = [
            "id",
            "student",
            "student_name",
            "subject",
            "subject_name",
            "subject_code",
            "term",
            "academic_year",
            "marks_obtained",
            "max_marks",
            "grade_letter",
            "remarks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, data):
        marks_obtained = data.get("marks_obtained")
        max_marks = data.get("max_marks")
        
        if marks_obtained and max_marks:
            if marks_obtained > max_marks:
                raise serializers.ValidationError(
                    "Marks obtained cannot exceed maximum marks"
                )
            if marks_obtained < 0:
                raise serializers.ValidationError(
                    "Marks obtained cannot be negative"
                )
            if max_marks <= 0:
                raise serializers.ValidationError(
                    "Maximum marks must be positive"
                )
        
        return data


class ReportCardSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.username", read_only=True)
    generated_by_name = serializers.CharField(source="generated_by.username", read_only=True)

    class Meta:
        model = ReportCard
        fields = [
            "id",
            "student",
            "student_name",
            "term",
            "academic_year",
            "total_marks_obtained",
            "total_max_marks",
            "percentage",
            "overall_grade",
            "class_rank",
            "attendance_percentage",
            "principal_remarks",
            "generated_at",
            "generated_by",
            "generated_by_name",
        ]
        read_only_fields = ["id", "generated_at", "generated_by"]

    def validate(self, data):
        total_marks_obtained = data.get("total_marks_obtained")
        total_max_marks = data.get("total_max_marks")
        percentage = data.get("percentage")
        
        if total_marks_obtained and total_max_marks:
            if total_marks_obtained > total_max_marks:
                raise serializers.ValidationError(
                    "Total marks obtained cannot exceed total maximum marks"
                )
            if total_marks_obtained < 0:
                raise serializers.ValidationError(
                    "Total marks obtained cannot be negative"
                )
            if total_max_marks <= 0:
                raise serializers.ValidationError(
                    "Total maximum marks must be positive"
                )
        
        if percentage and (percentage < 0 or percentage > 100):
            raise serializers.ValidationError(
                "Percentage must be between 0 and 100"
            )
        
        return data


class AnswerSheetSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.username", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    uploaded_by_name = serializers.CharField(source="uploaded_by.username", read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = AnswerSheet
        fields = [
            "id",
            "student",
            "student_name",
            "subject",
            "subject_name",
            "exam_name",
            "exam_date",
            "file",
            "file_url",
            "upload_type",
            "drive_link",
            "uploaded_at",
            "uploaded_by",
            "uploaded_by_name",
        ]
        read_only_fields = ["id", "uploaded_at", "uploaded_by"]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def validate(self, data):
        upload_type = data.get("upload_type")
        file = data.get("file")
        drive_link = data.get("drive_link")
        
        if upload_type == "direct_upload" and not file:
            raise serializers.ValidationError(
                "File is required when upload type is 'direct_upload'"
            )
        
        if upload_type == "drive_link" and not drive_link:
            raise serializers.ValidationError(
                "Drive link is required when upload type is 'drive_link'"
            )
        
        return data


class ScholarshipExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScholarshipExam
        fields = [
            "id",
            "name",
            "description",
            "exam_date",
            "registration_deadline",
            "max_marks",
            "passing_marks",
            "fee",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, data):
        max_marks = data.get("max_marks")
        passing_marks = data.get("passing_marks")
        fee = data.get("fee")
        
        if max_marks and passing_marks:
            if passing_marks > max_marks:
                raise serializers.ValidationError(
                    "Passing marks cannot exceed maximum marks"
                )
            if max_marks <= 0:
                raise serializers.ValidationError(
                    "Maximum marks must be positive"
                )
        
        if fee is not None and fee < 0:
            raise serializers.ValidationError(
                "Fee cannot be negative"
            )
        
        return data


class ExamParticipationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.username", read_only=True)
    exam_name = serializers.CharField(source="exam.name", read_only=True)

    class Meta:
        model = ExamParticipation
        fields = [
            "id",
            "exam",
            "exam_name",
            "student",
            "student_name",
            "registration_date",
            "roll_number",
            "exam_center",
            "fee_paid",
            "fee_payment_date",
            "payment_reference",
        ]
        read_only_fields = ["id", "registration_date"]

    def validate(self, data):
        exam = data.get("exam")
        student = data.get("student")
        
        # Check if student is already registered for this exam
        if exam and student:
            if ExamParticipation.objects.filter(exam=exam, student=student).exists():
                raise serializers.ValidationError(
                    "Student is already registered for this exam"
                )
        
        return data


class ExamResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="participation.student.user.username", read_only=True
    )
    exam_name = serializers.CharField(
        source="participation.exam.name", read_only=True
    )

    class Meta:
        model = ExamResult
        fields = [
            "id",
            "participation",
            "student_name",
            "exam_name",
            "marks_obtained",
            "grade",
            "rank",
            "percentile",
            "scholarship_awarded",
            "scholarship_amount",
            "result_declared_date",
            "remarks",
        ]
        read_only_fields = ["id", "result_declared_date"]

    def validate(self, data):
        participation = data.get("participation")
        marks_obtained = data.get("marks_obtained")
        scholarship_amount = data.get("scholarship_amount")
        
        if participation and marks_obtained:
            if marks_obtained > participation.exam.max_marks:
                raise serializers.ValidationError(
                    "Marks obtained cannot exceed exam maximum marks"
                )
            if marks_obtained < 0:
                raise serializers.ValidationError(
                    "Marks obtained cannot be negative"
                )
        
        if scholarship_amount is not None and scholarship_amount < 0:
            raise serializers.ValidationError(
                "Scholarship amount cannot be negative"
            )
        
        return data


class ReportCardGenerateSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    term = serializers.CharField(max_length=20)
    academic_year = serializers.CharField(max_length=10)
    attendance_percentage = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False
    )
    principal_remarks = serializers.CharField(required=False, allow_blank=True)

    def validate_student_id(self, value):
        from students.models import StudentProfile
        if not StudentProfile.objects.filter(id=value).exists():
            raise serializers.ValidationError("Student not found")
        return value


class SchoolPerformanceMetricsSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source="school.name", read_only=True)
    school_subdomain = serializers.CharField(source="school.subdomain", read_only=True)
    issued_by_name = serializers.CharField(source="issued_by.username", read_only=True)

    class Meta:
        model = SchoolPerformanceMetrics
        fields = [
            "id",
            "school",
            "school_name",
            "school_subdomain",
            "academic_year",
            "term",
            "total_students",
            "average_percentage",
            "pass_percentage",
            "subject_performance",
            "average_attendance",
            "scholarship_participation_rate",
            "scholarship_success_rate",
            "calculated_at",
        ]
        read_only_fields = ["id", "calculated_at"]


class HQNoticeSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source="school.name", read_only=True)
    school_subdomain = serializers.CharField(source="school.subdomain", read_only=True)
    issued_by_name = serializers.CharField(source="issued_by.username", read_only=True)
    acknowledged_by_name = serializers.CharField(source="acknowledged_by.username", read_only=True)

    class Meta:
        model = HQNotice
        fields = [
            "id",
            "school",
            "school_name",
            "school_subdomain",
            "title",
            "description",
            "notice_type",
            "priority",
            "issued_by",
            "issued_by_name",
            "issued_date",
            "is_acknowledged",
            "acknowledged_by",
            "acknowledged_by_name",
            "acknowledged_date",
            "action_required",
            "action_deadline",
            "action_taken",
        ]
        read_only_fields = ["id", "issued_date", "issued_by", "acknowledged_date", "acknowledged_by"]


class HQNoticeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HQNotice
        fields = [
            "school",
            "title",
            "description",
            "notice_type",
            "priority",
            "action_required",
            "action_deadline",
        ]

    def validate(self, data):
        if data.get("action_required") and not data.get("action_deadline"):
            raise serializers.ValidationError(
                "Action deadline is required when action is required"
            )
        return data


class HQNoticeAcknowledgeSerializer(serializers.Serializer):
    action_taken = serializers.CharField(required=False, allow_blank=True)
