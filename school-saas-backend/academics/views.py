from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

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
from academics.serializers import (
    SubjectSerializer,
    GradeSerializer,
    ReportCardSerializer,
    ReportCardGenerateSerializer,
    AnswerSheetSerializer,
    ScholarshipExamSerializer,
    ExamParticipationSerializer,
    ExamResultSerializer,
    SchoolPerformanceMetricsSerializer,
    HQNoticeSerializer,
    HQNoticeCreateSerializer,
    HQNoticeAcknowledgeSerializer,
)
from api.permissions import CanManageAcademicRecords, CanManageUsers
from students.models import StudentProfile
from django.db import transaction
from django.utils import timezone


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by("code")
    serializer_class = SubjectSerializer
    permission_classes = [CanManageAcademicRecords]


class GradeViewSet(viewsets.ModelViewSet):
    serializer_class = GradeSerializer
    permission_classes = [CanManageAcademicRecords]

    def get_queryset(self):
        user = self.request.user
        queryset = Grade.objects.select_related("student__user", "subject").order_by(
            "-academic_year", "term", "subject__code"
        )
        
        # Students can only see their own grades
        if user.role == "STUDENT":
            return queryset.filter(student__user=user)
        
        # Teachers can see grades for their school
        return queryset.filter(student__user__school=user.school)


class ReportCardViewSet(viewsets.ModelViewSet):
    serializer_class = ReportCardSerializer
    permission_classes = [CanManageAcademicRecords]

    def get_queryset(self):
        user = self.request.user
        queryset = ReportCard.objects.select_related("student__user", "generated_by").order_by(
            "-academic_year", "-term"
        )
        
        # Students can only see their own report cards
        if user.role == "STUDENT":
            return queryset.filter(student__user=user)
        
        # Teachers can see report cards for their school
        return queryset.filter(student__user__school=user.school)


class GenerateReportCardView(APIView):
    permission_classes = [CanManageAcademicRecords]

    def post(self, request):
        serializer = ReportCardGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        student_id = serializer.validated_data["student_id"]
        term = serializer.validated_data["term"]
        academic_year = serializer.validated_data["academic_year"]
        attendance_percentage = serializer.validated_data.get("attendance_percentage", 0)
        principal_remarks = serializer.validated_data.get("principal_remarks", "")
        
        try:
            with transaction.atomic():
                student = StudentProfile.objects.get(id=student_id)
                
                # Check if report card already exists
                if ReportCard.objects.filter(
                    student=student, term=term, academic_year=academic_year
                ).exists():
                    return Response(
                        {"error": "Report card already exists for this student, term, and year"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Get all grades for this student, term, and year
                grades = Grade.objects.filter(
                    student=student, term=term, academic_year=academic_year
                )
                
                if not grades.exists():
                    return Response(
                        {"error": "No grades found for this student, term, and year"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Calculate totals
                total_marks_obtained = sum(grade.marks_obtained for grade in grades)
                total_max_marks = sum(grade.max_marks for grade in grades)
                percentage = (total_marks_obtained / total_max_marks) * 100 if total_max_marks > 0 else 0
                
                # Determine overall grade
                if percentage >= 90:
                    overall_grade = "A+"
                elif percentage >= 80:
                    overall_grade = "A"
                elif percentage >= 70:
                    overall_grade = "B"
                elif percentage >= 60:
                    overall_grade = "C"
                elif percentage >= 50:
                    overall_grade = "D"
                else:
                    overall_grade = "F"
                
                # Calculate class rank
                class_students = StudentProfile.objects.filter(
                    user__school=student.user.school,
                    class_name=student.class_name,
                    section=student.section
                )
                class_report_cards = ReportCard.objects.filter(
                    student__in=class_students,
                    term=term,
                    academic_year=academic_year
                ).order_by("-percentage")
                
                class_rank = None
                if class_report_cards.exists():
                    class_rank = class_report_cards.count() + 1
                
                # Create report card
                report_card = ReportCard.objects.create(
                    student=student,
                    term=term,
                    academic_year=academic_year,
                    total_marks_obtained=total_marks_obtained,
                    total_max_marks=total_max_marks,
                    percentage=percentage,
                    overall_grade=overall_grade,
                    class_rank=class_rank,
                    attendance_percentage=attendance_percentage,
                    principal_remarks=principal_remarks,
                    generated_by=request.user
                )
                
                return Response(
                    ReportCardSerializer(report_card).data,
                    status=status.HTTP_201_CREATED
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


class AnswerSheetViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSheetSerializer
    permission_classes = [CanManageAcademicRecords]

    def get_queryset(self):
        user = self.request.user
        queryset = AnswerSheet.objects.select_related(
            "student__user", "subject", "uploaded_by"
        ).order_by("-exam_date", "-uploaded_at")
        
        # Students can only see their own answer sheets
        if user.role == "STUDENT":
            return queryset.filter(student__user=user)
        
        # Teachers can see answer sheets for their school
        return queryset.filter(student__user__school=user.school)

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class ScholarshipExamViewSet(viewsets.ModelViewSet):
    queryset = ScholarshipExam.objects.all().order_by("-exam_date")
    serializer_class = ScholarshipExamSerializer
    permission_classes = [CanManageAcademicRecords]


class ExamParticipationViewSet(viewsets.ModelViewSet):
    serializer_class = ExamParticipationSerializer
    permission_classes = [CanManageAcademicRecords]

    def get_queryset(self):
        user = self.request.user
        queryset = ExamParticipation.objects.select_related(
            "student__user", "exam"
        ).order_by("-registration_date")
        
        # Students can only see their own participations
        if user.role == "STUDENT":
            return queryset.filter(student__user=user)
        
        # Teachers can see participations for their school
        return queryset.filter(student__user__school=user.school)


class ExamResultViewSet(viewsets.ModelViewSet):
    serializer_class = ExamResultSerializer
    permission_classes = [CanManageAcademicRecords]

    def get_queryset(self):
        user = self.request.user
        queryset = ExamResult.objects.select_related(
            "participation__student__user", "participation__exam"
        ).order_by("-result_declared_date")
        
        # Students can only see their own results
        if user.role == "STUDENT":
            return queryset.filter(participation__student__user=user)
        
        # Teachers can see results for their school
        return queryset.filter(participation__student__user__school=user.school)


class StudentGradesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, student_id):
        try:
            student = StudentProfile.objects.get(id=student_id)
            
            # Check permissions
            if request.user.role == "STUDENT" and student.user != request.user:
                return Response(
                    {"error": "You can only view your own grades"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if student.user.school != request.user.school:
                return Response(
                    {"error": "You can only view grades from your school"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            grades = Grade.objects.filter(
                student=student
            ).select_related("subject").order_by("-academic_year", "term", "subject__code")
            
            serializer = GradeSerializer(grades, many=True)
            return Response(serializer.data)
            
        except StudentProfile.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class StudentReportCardsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, student_id):
        try:
            student = StudentProfile.objects.get(id=student_id)
            
            # Check permissions
            if request.user.role == "STUDENT" and student.user != request.user:
                return Response(
                    {"error": "You can only view your own report cards"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if student.user.school != request.user.school:
                return Response(
                    {"error": "You can only view report cards from your school"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            report_cards = ReportCard.objects.filter(
                student=student
            ).select_related("generated_by").order_by("-academic_year", "-term")
            
            serializer = ReportCardSerializer(report_cards, many=True)
            return Response(serializer.data)
            
        except StudentProfile.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class ClassPerformanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Only PRINCIPAL and TEACHER can access class performance
        if user.role not in ["PRINCIPAL", "TEACHER"]:
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        class_name = request.query_params.get("class_name")
        section = request.query_params.get("section")
        term = request.query_params.get("term", "Term 1")
        academic_year = request.query_params.get("academic_year", "2025-2026")
        
        if not class_name or not section:
            return Response(
                {"error": "class_name and section are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from students.models import StudentProfile
            
            # Get students in the class
            students = StudentProfile.objects.filter(
                class_name=class_name,
                section=section,
                user__school=user.school
            )
            
            # Get grades for these students
            grades = Grade.objects.filter(
                student__in=students,
                term=term,
                academic_year=academic_year
            ).select_related("subject", "student__user")
            
            # Calculate performance metrics
            total_students = students.count()
            grades_data = []
            
            for student in students:
                student_grades = grades.filter(student=student)
                total_marks = sum(g.marks_obtained for g in student_grades)
                max_marks = sum(g.max_marks for g in student_grades)
                percentage = (total_marks / max_marks * 100) if max_marks > 0 else 0
                
                grades_data.append({
                    "student_id": student.id,
                    "student_name": f"{student.user.first_name} {student.user.last_name}",
                    "percentage": round(percentage, 2),
                    "grades": [
                        {
                            "subject": g.subject.name,
                            "grade_letter": g.grade_letter,
                            "marks_obtained": g.marks_obtained,
                            "max_marks": g.max_marks
                        }
                        for g in student_grades
                    ]
                })
            
            # Calculate class averages
            if grades_data:
                class_average = sum(g["percentage"] for g in grades_data) / len(grades_data)
                pass_count = sum(1 for g in grades_data if g["percentage"] >= 50)
                pass_rate = (pass_count / len(grades_data)) * 100
            else:
                class_average = 0
                pass_rate = 0
            
            # Subject-wise performance
            subject_performance = {}
            for grade in grades:
                subject_id = grade.subject.id
                subject_name = grade.subject.name
                
                if subject_id not in subject_performance:
                    subject_performance[subject_id] = {
                        "subject_name": subject_name,
                        "total_students": 0,
                        "average_marks": 0,
                        "pass_rate": 0
                    }
                
                subject_performance[subject_id]["total_students"] += 1
                subject_performance[subject_id]["average_marks"] += grade.marks_obtained
                
                if grade.grade_letter in ["A+", "A", "B", "C", "D"]:
                    subject_performance[subject_id]["pass_rate"] += 1
            
            # Calculate subject averages
            for subject_id, data in subject_performance.items():
                if data["total_students"] > 0:
                    data["average_marks"] = round(data["average_marks"] / data["total_students"], 2)
                    data["pass_rate"] = round((data["pass_rate"] / data["total_students"]) * 100, 2)
            
            return Response({
                "class_name": class_name,
                "section": section,
                "term": term,
                "academic_year": academic_year,
                "total_students": total_students,
                "class_average": round(class_average, 2),
                "pass_rate": round(pass_rate, 2),
                "subject_performance": list(subject_performance.values()),
                "student_performance": sorted(grades_data, key=lambda x: x["percentage"], reverse=True)
            })
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SchoolPerformanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Only HQ can access school performance
        if request.user.role != "HQ":
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        academic_year = request.query_params.get("academic_year", "2025-2026")
        term = request.query_params.get("term", "Term 1")
        
        metrics = SchoolPerformanceMetrics.objects.filter(
            academic_year=academic_year,
            term=term
        ).select_related("school").order_by("-average_percentage")
        
        serializer = SchoolPerformanceMetricsSerializer(metrics, many=True)
        return Response(serializer.data)


class CalculateSchoolMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Only HQ can calculate metrics
        if request.user.role != "HQ":
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        academic_year = request.data.get("academic_year", "2025-2026")
        term = request.data.get("term", "Term 1")
        
        try:
            from students.models import StudentProfile
            from tenants.models import SchoolTenant
            
            schools = SchoolTenant.objects.filter(is_active=True)
            results = []
            
            for school in schools:
                # Get all students for this school
                students = StudentProfile.objects.filter(user__school=school)
                total_students = students.count()
                
                if total_students == 0:
                    continue
                
                # Get grades for this term/year
                grades = Grade.objects.filter(
                    student__in=students,
                    term=term,
                    academic_year=academic_year
                )
                
                if not grades.exists():
                    continue
                
                # Calculate overall metrics
                total_marks_obtained = sum(g.marks_obtained for g in grades)
                total_max_marks = sum(g.max_marks for g in grades)
                average_percentage = (total_marks_obtained / total_max_marks * 100) if total_max_marks > 0 else 0
                
                # Calculate pass rate
                passing_grades = grades.filter(grade_letter__in=["A+", "A", "B", "C", "D"])
                pass_percentage = (passing_grades.count() / grades.count() * 100) if grades.count() > 0 else 0 
                
                # Calculate subject-wise performance
                subject_performance = {}
                for grade in grades:
                    subject_id = grade.subject.id
                    if subject_id not in subject_performance:
                        subject_performance[subject_id] = {
                            "avg": 0,
                            "pass_rate": 0,
                            "count": 0
                        }
                    subject_performance[subject_id]["avg"] += grade.marks_obtained
                    subject_performance[subject_id]["count"] += 1
                    if grade.grade_letter in ["A+", "A", "B", "C", "D"]:
                        subject_performance[subject_id]["pass_rate"] += 1
                
                for subject_id, data in subject_performance.items():
                    if data["count"] > 0:
                        subject = Subject.objects.get(id=subject_id)
                        data["avg"] = round(data["avg"] / data["count"], 2)
                        data["pass_rate"] = round((data["pass_rate"] / data["count"]) * 100, 2)
                        subject_performance[subject_id] = {
                            "subject_name": subject.name,
                            "average": data["avg"],
                            "pass_rate": data["pass_rate"]
                        }
                
                # Calculate attendance
                report_cards = ReportCard.objects.filter(
                    student__in=students,
                    term=term,
                    academic_year=academic_year
                )
                average_attendance = sum(rc.attendance_percentage for rc in report_cards) / report_cards.count() if report_cards.count() > 0 else 0
                
                # Calculate scholarship metrics
                participations = ExamParticipation.objects.filter(
                    student__in=students,
                    exam__is_active=True
                )
                scholarship_participation_rate = (participations.count() / total_students * 100) if total_students > 0 else 0
                
                results_with_scholarship = participations.filter(result__scholarship_awarded=True)
                scholarship_success_rate = (results_with_scholarship.count() / participations.count() * 100) if participations.count() > 0 else 0
                
                # Create or update metrics
                metrics, created = SchoolPerformanceMetrics.objects.update_or_create(
                    school=school,
                    academic_year=academic_year,
                    term=term,
                    defaults={
                        "total_students": total_students,
                        "average_percentage": round(average_percentage, 2),
                        "pass_percentage": round(pass_percentage, 2),
                        "subject_performance": subject_performance,
                        "average_attendance": round(average_attendance, 2),
                        "scholarship_participation_rate": round(scholarship_participation_rate, 2),
                        "scholarship_success_rate": round(scholarship_success_rate, 2),
                    }
                )
                
                results.append(SchoolPerformanceMetricsSerializer(metrics).data)
            
            return Response({
                "message": "Metrics calculated successfully",
                "results": results
            })
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class HQNoticeViewSet(viewsets.ModelViewSet):
    serializer_class = HQNoticeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # HQ can see all notices
        if user.role == "HQ":
            return HQNotice.objects.select_related("school", "issued_by", "acknowledged_by").order_by("-issued_date")
        
        # PRINCIPAL can only see notices for their school
        if user.role == "PRINCIPAL":
            return HQNotice.objects.filter(
                school=user.school
            ).select_related("school", "issued_by", "acknowledged_by").order_by("-issued_date")
        
        return HQNotice.objects.none()

    def get_serializer_class(self):
        if self.action == "create":
            return HQNoticeCreateSerializer
        return HQNoticeSerializer

    def perform_create(self, serializer):
        serializer.save(issued_by=self.request.user)


class AcknowledgeNoticeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, notice_id):
        # Only PRINCIPAL can acknowledge notices
        if request.user.role != "PRINCIPAL":
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            notice = HQNotice.objects.get(id=notice_id)
            
            # Check if notice belongs to principal's school
            if notice.school != request.user.school:
                return Response(
                    {"error": "Notice not found for your school"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = HQNoticeAcknowledgeSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            notice.is_acknowledged = True
            notice.acknowledged_by = request.user
            notice.acknowledged_date = timezone.now()
            notice.action_taken = serializer.validated_data.get("action_taken", "")
            notice.save()
            
            return Response(HQNoticeSerializer(notice).data)
            
        except HQNotice.DoesNotExist:
            return Response(
                {"error": "Notice not found"},
                status=status.HTTP_404_NOT_FOUND
            )
