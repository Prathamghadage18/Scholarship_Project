"""Seed development users for local testing.

Usage:
    python scripts/seed_dev_users.py
"""
import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model
from tenants.models import SchoolTenant

User = get_user_model()

SEED_SCHOOL = {
    "name": "Demo School",
    "subdomain": "demo",
    "contact_email": "admin@demo-school.local",
}

SEED_USERS = [
    {
        "username": "hq_admin",
        "email": "hq@demo-school.local",
        "password": "Hq@12345",
        "first_name": "HQ",
        "last_name": "Admin",
        "role": User.Role.HQ,
        "school": None,
    },
    {
        "username": "principal_demo",
        "email": "principal@demo-school.local",
        "password": "Prin@12345",
        "first_name": "Priya",
        "last_name": "Principal",
        "role": User.Role.PRINCIPAL,
        "school_subdomain": "demo",
    },
    {
        "username": "teacher_demo",
        "email": "teacher@demo-school.local",
        "password": "Teach@12345",
        "first_name": "Tom",
        "last_name": "Teacher",
        "role": User.Role.TEACHER,
        "school_subdomain": "demo",
    },
    {
        "username": "student_demo",
        "email": "student@demo-school.local",
        "password": "Stud@12345",
        "first_name": "Sam",
        "last_name": "Student",
        "role": User.Role.STUDENT,
        "school_subdomain": "demo",
    },
    {
        "username": "parent_demo",
        "email": "parent@demo-school.local",
        "password": "Par@12345",
        "first_name": "Pam",
        "last_name": "Parent",
        "role": User.Role.PARENT,
        "school_subdomain": "demo",
    },
]


def seed():
    school, _ = SchoolTenant.objects.get_or_create(
        subdomain=SEED_SCHOOL["subdomain"],
        defaults=SEED_SCHOOL,
    )

    created = []
    for seed_user in SEED_USERS:
        school_subdomain = seed_user.pop("school_subdomain", None)
        defaults = {
            "email": seed_user["email"],
            "first_name": seed_user["first_name"],
            "last_name": seed_user["last_name"],
            "role": seed_user["role"],
            "school": school if school_subdomain else None,
        }
        user, is_created = User.objects.get_or_create(
            username=seed_user["username"],
            defaults=defaults,
        )
        if is_created:
            user.set_password(seed_user["password"])
            user.save()
            created.append(user.username)

    return school, created


if __name__ == "__main__":
    school, created_users = seed()
    print(f"Seeded school: {school.subdomain}")
    print(f"Created users: {', '.join(created_users) if created_users else 'none'}")
