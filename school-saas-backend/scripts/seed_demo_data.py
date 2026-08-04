import os
import sys
import django
import random
from datetime import datetime, timedelta

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.db import transaction
from tenants.models import SchoolTenant
from headquarters.models import User
from students.models import StudentProfile
from teachers.models import TeacherProfile
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


def generate_random_name():
    first_names = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Jennifer", "William", "Amanda", "Richard", "Jessica", "Joseph", "Ashley", "Thomas", "Stephanie", "Charles", "Nicole"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White"]
    return random.choice(first_names), random.choice(last_names)


def generate_grade_letter(percentage):
    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B"
    elif percentage >= 60:
        return "C"
    elif percentage >= 50:
        return "D"
    else:
        return "F"


def seed_demo_data():
    print("Starting comprehensive demo data seeding...")
    print("This may take a few minutes due to the amount of data being created...")
    
    # Create 3 schools
    schools_data = [
        {
            "name": "Springfield Elementary",
            "subdomain": "springfield",
            "contact_email": "contact@springfield.com",
            "is_active": True,
        },
        {
            "name": "Riverside Academy",
            "subdomain": "riverside",
            "contact_email": "contact@riverside.com",
            "is_active": True,
        },
        {
            "name": "Oakwood School",
            "subdomain": "oakwood",
            "contact_email": "contact@oakwood.com",
            "is_active": True,
        },
    ]
    
    schools = []
    for school_data in schools_data:
        school, created = SchoolTenant.objects.get_or_create(
            subdomain=school_data["subdomain"],
            defaults=school_data
        )
        if created:
            print(f"Created school: {school.name}")
        else:
            print(f"School already exists: {school.name}")
        schools.append(school)
    
    # Create HQ user
    hq_user, created = User.objects.get_or_create(
        username="hq_admin",
        defaults={
            "email": "hq@schoolsaas.com",
            "first_name": "HQ",
            "last_name": "Admin",
            "role": "HQ",
            "school": None,
        }
    )
    if created:
        hq_user.set_password("admin123")
        hq_user.save()
        print("Created HQ admin user")
    
    # Create subjects
    subjects_data = [
        {"name": "Mathematics", "code": "MATH", "description": "Mathematics"},
        {"name": "English", "code": "ENG", "description": "English Language"},
        {"name": "Science", "code": "SCI", "description": "General Science"},
        {"name": "Social Studies", "code": "SS", "description": "Social Studies"},
        {"name": "Computer Science", "code": "CS", "description": "Computer Science"},
        {"name": "Physical Education", "code": "PE", "description": "Physical Education"},
        {"name": "Art", "code": "ART", "description": "Art and Craft"},
        {"name": "Music", "code": "MUS", "description": "Music"},
    ]
    
    subjects = []
    for subject_data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            code=subject_data["code"],
            defaults=subject_data
        )
        if created:
            print(f"Created subject: {subject.name}")
        subjects.append(subject)
    
    # Classes for each school
    classes = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"]
    sections = ["A", "B"]
    
    academic_year = "2025-2026"
    terms = ["Term 1", "Term 2", "Term 3"]
    
    total_students = 0
    total_teachers = 0
    
    for school in schools:
        print(f"\nSeeding data for {school.name}...")
        
        # Create Principal
        principal, created = User.objects.get_or_create(
            username=f"{school.subdomain}_principal",
            defaults={
                "email": f"principal@{school.subdomain}.com",
                "first_name": "Principal",
                "last_name": school.name.split()[0],
                "role": "PRINCIPAL",
                "school": school,
            }
        )
        if created:
            principal.set_password("principal123")
            principal.save()
            print(f"Created principal for {school.name}")
        
        # Create Teachers (2 per class)
        teachers = []
        for class_name in classes:
            for section in sections:
                for teacher_num in range(2):
                    first_name, last_name = generate_random_name()
                    username = f"{school.subdomain}_teacher_{class_name}_{section}_{teacher_num}"
                    teacher_user, created = User.objects.get_or_create(
                        username=username,
                        defaults={
                            "email": f"{username}@{school.subdomain}.com",
                            "first_name": first_name,
                            "last_name": last_name,
                            "role": "TEACHER",
                            "school": school,
                        }
                    )
                    if created:
                        teacher_user.set_password("teacher123")
                        teacher_user.save()
                        
                        # Create Teacher Profile
                        TeacherProfile.objects.get_or_create(
                            user=teacher_user,
                            defaults={
                                "employee_id": f"EMP{random.randint(1000, 9999)}",
                                "subject_name": random.choice([s.name for s in subjects]),
                                "assigned_class": f"{class_name}-{section}",
                            }
                        )
                        teachers.append(teacher_user)
                        total_teachers += 1
        
        print(f"Created {len(teachers)} teachers for {school.name}")
        
        # Create Students and Parents
        for class_name in classes:
            for section in sections:
                for student_num in range(10):
                    first_name, last_name = generate_random_name()
                    username = f"{school.subdomain}_student_{class_name}_{section}_{student_num}"
                    
                    # Create Student
                    student_user, created = User.objects.get_or_create(
                        username=username,
                        defaults={
                            "email": f"{username}@{school.subdomain}.com",
                            "first_name": first_name,
                            "last_name": last_name,
                            "role": "STUDENT",
                            "school": school,
                        }
                    )
                    if created:
                        student_user.set_password("student123")
                        student_user.save()
                        
                        # Create Student Profile
                        student_profile, _ = StudentProfile.objects.get_or_create(
                            user=student_user,
                            defaults={
                                "admission_number": f"ADM{random.randint(10000, 99999)}",
                                "class_name": class_name,
                                "section": section,
                            }
                        )
                        
                        # Create Parent
                        parent_username = f"{username}_parent"
                        parent_user, created = User.objects.get_or_create(
                            username=parent_username,
                            defaults={
                                "email": f"{parent_username}@{school.subdomain}.com",
                                "first_name": first_name,
                                "last_name": last_name,
                                "role": "PARENT",
                                "school": school,
                            }
                        )
                        if created:
                            parent_user.set_password("parent123")
                            parent_user.save()
                        
                        # Link parent to student
                        student_profile.parent = parent_user
                        student_profile.save()
                        
                        total_students += 1
                        
                        # Create Grades for all subjects and terms
                        for term in terms:
                            for subject in subjects[:5]:  # 5 subjects per term
                                max_marks = 100
                                marks_obtained = random.randint(40, 100)
                                grade_letter = generate_grade_letter(marks_obtained)
                                
                                Grade.objects.get_or_create(
                                    student=student_profile,
                                    subject=subject,
                                    term=term,
                                    academic_year=academic_year,
                                    defaults={
                                        "marks_obtained": marks_obtained,
                                        "max_marks": max_marks,
                                        "grade_letter": grade_letter,
                                        "remarks": random.choice(["Good", "Excellent", "Needs Improvement", "Keep it up"]),
                                    }
                                )
                        
                        # Create Report Cards
                        for term in terms:
                            grades = Grade.objects.filter(
                                student=student_profile,
                                term=term,
                                academic_year=academic_year
                            )
                            
                            if grades.exists():
                                total_marks_obtained = sum(g.marks_obtained for g in grades)
                                total_max_marks = sum(g.max_marks for g in grades)
                                percentage = (total_marks_obtained / total_max_marks * 100) if total_max_marks > 0 else 0
                                overall_grade = generate_grade_letter(percentage)
                                
                                ReportCard.objects.get_or_create(
                                    student=student_profile,
                                    term=term,
                                    academic_year=academic_year,
                                    defaults={
                                        "total_marks_obtained": total_marks_obtained,
                                        "total_max_marks": total_max_marks,
                                        "percentage": percentage,
                                        "overall_grade": overall_grade,
                                        "attendance_percentage": random.uniform(75, 100),
                                        "principal_remarks": random.choice(["Good performance", "Excellent work", "Needs improvement", "Keep working hard"]),
                                        "generated_by": principal,
                                    }
                                )
                        
                        # Create Answer Sheets
                        for term in terms:
                            for subject in subjects[:3]:
                                exam_name = f"{term} {subject.name} Exam"
                                exam_date = datetime.now() - timedelta(days=random.randint(30, 90))
                                
                                AnswerSheet.objects.get_or_create(
                                    student=student_profile,
                                    subject=subject,
                                    exam_name=exam_name,
                                    exam_date=exam_date,
                                    defaults={
                                        "upload_type": "drive_link",
                                        "drive_link": f"https://drive.google.com/file/d/{random.randint(1000000000000, 9999999999999)}/view",
                                    }
                                )
        
        print(f"Created students for {school.name}")
    
    print(f"\nTotal students created: {total_students}")
    print(f"Total teachers created: {total_teachers}")
    
    # Create Scholarship Exams
    print("\nCreating scholarship exams...")
    scholarship_exams_data = [
        {
            "name": "National Talent Search Exam",
            "description": "Annual national level talent search examination",
            "exam_date": datetime.now() + timedelta(days=30),
            "registration_deadline": datetime.now() + timedelta(days=15),
            "max_marks": 100,
            "passing_marks": 50,
            "fee": 50.00,
            "is_active": True,
        },
        {
            "name": "Science Olympiad",
            "description": "International science competition",
            "exam_date": datetime.now() + timedelta(days=60),
            "registration_deadline": datetime.now() + timedelta(days=30),
            "max_marks": 100,
            "passing_marks": 40,
            "fee": 75.00,
            "is_active": True,
        },
        {
            "name": "Mathematics Challenge",
            "description": "National mathematics competition",
            "exam_date": datetime.now() + timedelta(days=45),
            "registration_deadline": datetime.now() + timedelta(days=20),
            "max_marks": 100,
            "passing_marks": 45,
            "fee": 40.00,
            "is_active": True,
        },
    ]
    
    scholarship_exams = []
    for exam_data in scholarship_exams_data:
        exam, created = ScholarshipExam.objects.get_or_create(
            name=exam_data["name"],
            defaults=exam_data
        )
        if created:
            print(f"Created scholarship exam: {exam.name}")
        scholarship_exams.append(exam)
    
    # Create Exam Participations and Results
    print("\nCreating exam participations and results...")
    for school in schools:
        students = StudentProfile.objects.filter(user__school=school)
        
        for exam in scholarship_exams:
            # Select random students for participation (about 30% of students)
            participating_students = random.sample(
                list(students),
                min(len(students), int(len(students) * 0.3))
            )
            
            for student in participating_students:
                participation, created = ExamParticipation.objects.get_or_create(
                    exam=exam,
                    student=student,
                    defaults={
                        "roll_number": f"ROLL{random.randint(100000, 999999)}",
                        "exam_center": f"{school.name} Center",
                        "fee_paid": random.choice([True, False]),
                    }
                )
                
                if created:
                    # Create result for some participations
                    if random.random() > 0.3:  # 70% have results
                        marks_obtained = random.randint(30, 100)
                        grade = generate_grade_letter(marks_obtained)
                        scholarship_awarded = marks_obtained >= 85
                        
                        ExamResult.objects.get_or_create(
                            participation=participation,
                            defaults={
                                "marks_obtained": marks_obtained,
                                "grade": grade,
                                "rank": random.randint(1, 100) if marks_obtained >= 70 else None,
                                "percentile": random.uniform(50, 99) if marks_obtained >= 70 else None,
                                "scholarship_awarded": scholarship_awarded,
                                "scholarship_amount": random.uniform(500, 2000) if scholarship_awarded else None,
                                "remarks": random.choice(["Excellent", "Good", "Average", "Needs improvement"]),
                            }
                        )
    
    # Calculate School Performance Metrics
    print("\nCalculating school performance metrics...")
    for school in schools:
        for term in terms:
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
            SchoolPerformanceMetrics.objects.update_or_create(
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
    
    print("School performance metrics calculated")
    
    # Create HQ Notices
    print("\nCreating HQ notices...")
    notice_types = [
        ("performance_warning", "high", "Performance Improvement Required", "Your school's performance in Term 1 has been below the expected standards. Please implement corrective measures."),
        ("compliance", "medium", "Attendance Compliance", "Please ensure that daily attendance records are maintained and submitted on time."),
        ("general", "low", "Upcoming Events", "Please note the upcoming district-level competitions and prepare your students accordingly."),
    ]
    
    for school in schools:
        for notice_type, priority, title, description in notice_types:
            HQNotice.objects.get_or_create(
                school=school,
                title=title,
                notice_type=notice_type,
                defaults={
                    "description": description,
                    "priority": priority,
                    "issued_by": hq_user,
                    "action_required": notice_type == "performance_warning",
                    "action_deadline": datetime.now() + timedelta(days=30) if notice_type == "performance_warning" else None,
                }
            )
    
    print("HQ notices created")
    
    print("\n" + "="*50)
    print("Demo data seeding completed successfully!")
    print("="*50)
    print(f"\nSchools created: {len(schools)}")
    print(f"Total students: {total_students}")
    print(f"Total teachers: {total_teachers}")
    print(f"Subjects: {len(subjects)}")
    print(f"Scholarship exams: {len(scholarship_exams)}")
    print(f"Terms: {len(terms)}")
    print(f"Classes per school: {len(classes)}")
    print(f"Sections per class: {len(sections)}")
    print(f"Students per class-section: 10")
    print("\nLogin credentials:")
    print("HQ Admin: username='hq_admin', password='admin123'")
    print("Principals: username='{school_subdomain}_principal', password='principal123'")
    print("Teachers: username='{school_subdomain}_teacher_{class}_{section}_{num}', password='teacher123'")
    print("Students: username='{school_subdomain}_student_{class}_{section}_{num}', password='student123'")
    print("Parents: username='{student_username}_parent', password='parent123'")
    print("\n" + "="*50)


if __name__ == "__main__":
    seed_demo_data()
