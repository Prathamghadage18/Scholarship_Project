from django.urls import path, include
from rest_framework.routers import DefaultRouter

from academics.views import (
    SubjectViewSet,
    GradeViewSet,
    ReportCardViewSet,
    GenerateReportCardView,
    AnswerSheetViewSet,
    ScholarshipExamViewSet,
    ExamParticipationViewSet,
    ExamResultViewSet,
    StudentGradesView,
    StudentReportCardsView,
    ClassPerformanceView,
    SchoolPerformanceView,
    CalculateSchoolMetricsView,
    HQNoticeViewSet,
    AcknowledgeNoticeView,
)

router = DefaultRouter()
router.register(r"subjects", SubjectViewSet, basename="subject")
router.register(r"grades", GradeViewSet, basename="grade")
router.register(r"report-cards", ReportCardViewSet, basename="report-card")
router.register(r"answer-sheets", AnswerSheetViewSet, basename="answer-sheet")
router.register(r"scholarship-exams", ScholarshipExamViewSet, basename="scholarship-exam")
router.register(r"exam-participations", ExamParticipationViewSet, basename="exam-participation")
router.register(r"exam-results", ExamResultViewSet, basename="exam-result")
router.register(r"notices", HQNoticeViewSet, basename="hq-notice")

urlpatterns = [
    path("report-cards/generate/", GenerateReportCardView.as_view(), name="generate-report-card"),
    path("students/<int:student_id>/grades/", StudentGradesView.as_view(), name="student-grades"),
    path("students/<int:student_id>/report-cards/", StudentReportCardsView.as_view(), name="student-report-cards"),
    path("class-performance/", ClassPerformanceView.as_view(), name="class-performance"),
    path("school-performance/", SchoolPerformanceView.as_view(), name="school-performance"),
    path("calculate-school-metrics/", CalculateSchoolMetricsView.as_view(), name="calculate-school-metrics"),
    path("notices/<int:notice_id>/acknowledge/", AcknowledgeNoticeView.as_view(), name="acknowledge-notice"),
    path("", include(router.urls)),
]
