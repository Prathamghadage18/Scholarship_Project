from django.db import models
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from tenants.models import SchoolTenant


class Subject(models.Model):
    """Subject for grading and exams"""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    class Meta:
        ordering = ["code"]


class Grade(models.Model):
    """Individual grade for a student in a subject"""
    student = models.ForeignKey(
        'students.StudentProfile',
        on_delete=models.CASCADE,
        related_name='grades'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='grades'
    )
    term = models.CharField(max_length=20)  # e.g., "Term 1", "Term 2"
    academic_year = models.CharField(max_length=10)  # e.g., "2025-2026"
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    max_marks = models.DecimalField(max_digits=5, decimal_places=2)
    grade_letter = models.CharField(max_length=2)  # e.g., "A+", "B", "C"
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.user.username} - {self.subject.name} ({self.grade_letter})"

    class Meta:
        unique_together = ['student', 'subject', 'term', 'academic_year']
        ordering = ['-academic_year', 'term', 'subject__code']


class ReportCard(models.Model):
    """Generated report card for a student"""
    student = models.ForeignKey(
        'students.StudentProfile',
        on_delete=models.CASCADE,
        related_name='report_cards'
    )
    term = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=10)
    total_marks_obtained = models.DecimalField(max_digits=7, decimal_places=2)
    total_max_marks = models.DecimalField(max_digits=7, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    overall_grade = models.CharField(max_length=2)
    class_rank = models.IntegerField(null=True, blank=True)
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    principal_remarks = models.TextField(blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(
        'headquarters.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='generated_report_cards'
    )

    def __str__(self):
        return f"Report Card - {self.student.user.username} ({self.term} {self.academic_year})"

    class Meta:
        unique_together = ['student', 'term', 'academic_year']
        ordering = ['-academic_year', '-term']


class AnswerSheet(models.Model):
    """Uploaded answer sheet for exams"""
    student = models.ForeignKey(
        'students.StudentProfile',
        on_delete=models.CASCADE,
        related_name='answer_sheets'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='answer_sheets'
    )
    exam_name = models.CharField(max_length=200)
    exam_date = models.DateField()
    file = models.FileField(upload_to='answer_sheets/%Y/%m/')
    upload_type = models.CharField(
        max_length=20,
        choices=[
            ('direct_upload', 'Direct Upload'),
            ('drive_link', 'Drive Link')
        ],
        default='direct_upload'
    )
    drive_link = models.URLField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        'headquarters.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_answer_sheets'
    )

    def clean(self):
        if self.upload_type == 'drive_link' and not self.drive_link:
            raise ValidationError("Drive link is required when upload type is 'drive_link'")
        if self.upload_type == 'direct_upload' and not self.file:
            raise ValidationError("File is required when upload type is 'direct_upload'")

    def __str__(self):
        return f"{self.student.user.username} - {self.exam_name}"

    class Meta:
        ordering = ['-exam_date', '-uploaded_at']


class ScholarshipExam(models.Model):
    """Scholarship examination details"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    exam_date = models.DateField()
    registration_deadline = models.DateField()
    max_marks = models.DecimalField(max_digits=5, decimal_places=2)
    passing_marks = models.DecimalField(max_digits=5, decimal_places=2)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-exam_date']


class ExamParticipation(models.Model):
    """Student participation in scholarship exams"""
    exam = models.ForeignKey(
        ScholarshipExam,
        on_delete=models.CASCADE,
        related_name='participations'
    )
    student = models.ForeignKey(
        'students.StudentProfile',
        on_delete=models.CASCADE,
        related_name='exam_participations'
    )
    registration_date = models.DateTimeField(auto_now_add=True)
    roll_number = models.CharField(max_length=50, unique=True)
    exam_center = models.CharField(max_length=200)
    fee_paid = models.BooleanField(default=False)
    fee_payment_date = models.DateField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.student.user.username} - {self.exam.name}"

    class Meta:
        unique_together = ['exam', 'student']
        ordering = ['-registration_date']


class ExamResult(models.Model):
    """Results for scholarship exams"""
    participation = models.OneToOneField(
        ExamParticipation,
        on_delete=models.CASCADE,
        related_name='result'
    )
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=2)
    rank = models.IntegerField(null=True, blank=True)
    percentile = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    scholarship_awarded = models.BooleanField(default=False)
    scholarship_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    result_declared_date = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"{self.participation.student.user.username} - {self.participation.exam.name} ({self.grade})"

    class Meta:
        ordering = ['-result_declared_date']


class SchoolPerformanceMetrics(models.Model):
    """Performance metrics for schools (calculated periodically)"""
    school = models.ForeignKey(
        SchoolTenant,
        on_delete=models.CASCADE,
        related_name='performance_metrics'
    )
    academic_year = models.CharField(max_length=10)  # e.g., "2025-2026"
    term = models.CharField(max_length=20)  # e.g., "Term 1"
    
    # Overall metrics
    total_students = models.IntegerField(default=0)
    average_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    pass_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Subject-wise metrics (stored as JSON)
    subject_performance = models.JSONField(default=dict)  # {subject_id: {avg: 85, pass_rate: 90}}
    
    # Attendance metrics
    average_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Scholarship performance
    scholarship_participation_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    scholarship_success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    calculated_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.school.name} - {self.term} {self.academic_year}"

    class Meta:
        unique_together = ['school', 'academic_year', 'term']
        ordering = ['-academic_year', '-term']


class HQNotice(models.Model):
    """Notices issued by HQ to schools"""
    school = models.ForeignKey(
        SchoolTenant,
        on_delete=models.CASCADE,
        related_name='hq_notices'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    notice_type = models.CharField(
        max_length=50,
        choices=[
            ('performance_warning', 'Performance Warning'),
            ('compliance', 'Compliance Notice'),
            ('general', 'General Notice'),
            ('urgent', 'Urgent Notice'),
        ],
        default='general'
    )
    priority = models.CharField(
        max_length=20,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
            ('critical', 'Critical'),
        ],
        default='medium'
    )
    issued_by = models.ForeignKey(
        'headquarters.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='issued_notices'
    )
    issued_date = models.DateTimeField(auto_now_add=True)
    is_acknowledged = models.BooleanField(default=False)
    acknowledged_by = models.ForeignKey(
        'headquarters.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='acknowledged_notices'
    )
    acknowledged_date = models.DateTimeField(null=True, blank=True)
    action_required = models.BooleanField(default=False)
    action_deadline = models.DateField(null=True, blank=True)
    action_taken = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.school.name}"

    class Meta:
        ordering = ['-issued_date']
