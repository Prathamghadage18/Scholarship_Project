from django.conf import settings
from django.db import models


class TeacherProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="teacher_profile")
    employee_id = models.CharField(max_length=50, unique=True)
    subject_name = models.CharField(max_length=100, blank=True)
    assigned_class = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.employee_id


class TimetableEntry(models.Model):
    class DayOfWeek(models.TextChoices):
        MONDAY = "MONDAY", "Monday"
        TUESDAY = "TUESDAY", "Tuesday"
        WEDNESDAY = "WEDNESDAY", "Wednesday"
        THURSDAY = "THURSDAY", "Thursday"
        FRIDAY = "FRIDAY", "Friday"
        SATURDAY = "SATURDAY", "Saturday"

    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE, related_name="timetable_entries")
    class_name = models.CharField(max_length=50)
    section = models.CharField(max_length=20, blank=True)
    subject_name = models.CharField(max_length=100)
    room_name = models.CharField(max_length=50)
    day_of_week = models.CharField(max_length=20, choices=DayOfWeek.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["day_of_week", "start_time", "class_name", "section"]

    def __str__(self):
        return f"{self.class_name}-{self.section} {self.subject_name} ({self.day_of_week})"
