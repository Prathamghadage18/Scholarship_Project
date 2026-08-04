"""
Script to enable schema-based multi-tenancy with django-tenants.

This script helps migrate from single-tenant (SQLite) to multi-tenant (PostgreSQL) mode.
Run this after setting up PostgreSQL and updating .env file.
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
django.setup()

from django.conf import settings
from django.core.management import call_command
from django.db import connection


def check_postgres_connection():
    """Check if PostgreSQL is accessible."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT version()")
            version = cursor.fetchone()[0]
            print(f"✓ PostgreSQL connected: {version[:50]}...")
            return True
    except Exception as e:
        print(f"✗ PostgreSQL connection failed: {e}")
        return False


def migrate_shared_apps():
    """Run migrations for shared apps (public schema)."""
    print("\n" + "="*60)
    print("Migrating shared apps to public schema...")
    print("="*60)
    call_command('migrate_schemas', '--shared', verbosity=2)


def migrate_tenant_apps():
    """Run migrations for tenant apps (will be applied to each tenant schema)."""
    print("\n" + "="*60)
    print("Migrating tenant apps...")
    print("="*60)
    call_command('migrate_schemas', verbosity=2)


def create_public_tenant():
    """Create a public/tenant for the main domain."""
    from tenants.models import SchoolTenant, Domain
    
    print("\n" + "="*60)
    print("Creating public tenant...")
    print("="*60)
    
    # Check if public tenant already exists
    if Domain.objects.filter(domain='localhost').exists():
        print("✓ Public tenant already exists")
        return
    
    # Create public tenant
    public_tenant = SchoolTenant.objects.create(
        name='Public',
        subdomain='public',
        contact_email='admin@localhost',
        is_active=True
    )
    
    # Create public domain
    Domain.objects.create(
        domain='localhost',
        tenant=public_tenant,
        is_primary=True
    )
    
    print(f"✓ Created public tenant: {public_tenant.name}")
    print(f"✓ Created public domain: localhost")


def main():
    print("="*60)
    print("School SaaS - Enable Multi-Tenancy")
    print("="*60)
    
    # Check if multi-tenancy is enabled
    if not getattr(settings, 'USE_DJANGO_TENANTS', False):
        print("✗ Multi-tenancy is not enabled in settings.")
        print("  Set USE_DJANGO_TENANTS=1 in your .env file")
        sys.exit(1)
    
    print(f"✓ Multi-tenancy mode: ENABLED")
    print(f"✓ Base domain: {getattr(settings, 'BASE_DOMAIN', 'localhost')}")
    
    # Check PostgreSQL connection
    if not check_postgres_connection():
        print("\n✗ Please ensure PostgreSQL is running and credentials are correct in .env")
        sys.exit(1)
    
    # Run migrations
    try:
        migrate_shared_apps()
        create_public_tenant()
        migrate_tenant_apps()
        
        print("\n" + "="*60)
        print("✓ Multi-tenancy setup completed successfully!")
        print("="*60)
        print("\nNext steps:")
        print("1. Create school tenants via API or admin panel")
        print("2. Each tenant will get its own schema (e.g., demo.localhost)")
        print("3. Access schools via subdomains: http://subdomain.localhost")
        print("\nNote: For local development, add subdomains to /etc/hosts:")
        print("  127.0.0.1 demo.localhost")
        print("  127.0.0.1 school1.localhost")
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
