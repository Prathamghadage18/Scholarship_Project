from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending transactional emails"""
    
    @staticmethod
    def send_welcome_email(principal_name, school_name, subdomain, username, recipient_email):
        """
        Send welcome email to new principal when tenant is created
        """
        subject = f"Welcome to {school_name} - Your Principal Account is Ready"
        
        # For now, use simple HTML template. Later integrate with React Email
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                <h1 style="color: #333; font-size: 24px; margin: 40px 0;">Welcome to {school_name}!</h1>
                <p style="color: #333; font-size: 16px; line-height: 26px;">Dear {principal_name},</p>
                <p style="color: #333; font-size: 16px; line-height: 26px;">
                    Congratulations! Your school has been successfully created in our system. 
                    You are now the Principal of {school_name}.
                </p>
                <div style="margin: 32px 0; padding: 20px; background-color: #f0f4f8; border-radius: 8px;">
                    <p style="color: #333; font-size: 16px; margin: 8px 0;"><strong>Username:</strong> {username}</p>
                    <p style="color: #333; font-size: 16px; margin: 8px 0;"><strong>School Subdomain:</strong> {subdomain}.localhost</p>
                    <p style="color: #333; font-size: 16px; margin: 8px 0;"><strong>Role:</strong> Principal</p>
                </div>
                <p style="color: #333; font-size: 16px; line-height: 26px;">
                    As Principal, you can now:
                </p>
                <ul style="margin: 16px 0; padding-left: 20px; color: #333;">
                    <li style="margin: 8px 0;">Add and manage teachers</li>
                    <li style="margin: 8px 0;">Add and manage students</li>
                    <li style="margin: 8px 0;">Manage timetables and classes</li>
                    <li style="margin: 8px 0;">Handle day-to-day school operations</li>
                </ul>
                <p style="color: #8898aa; font-size: 12px; margin-top: 32px;">
                    If you have any questions, please contact our support team.
                </p>
                <p style="color: #8898aa; font-size: 12px;">
                    © {2026} School CRM. All rights reserved.
                </p>
            </div>
        </body>
        </html>
        """
        
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                html_message=html_message,
                fail_silently=False,
            )
            logger.info(f"Welcome email sent to {recipient_email} for school {school_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to send welcome email to {recipient_email}: {str(e)}")
            return False
    
    @staticmethod
    def send_attendance_email(student_name, parent_name, date, status, school_name, recipient_email):
        """
        Send attendance notification to parent
        """
        status_color = "#10b981" if status == "Present" else "#ef4444" if status == "Absent" else "#f59e0b"
        
        subject = f"Attendance Update for {student_name} - {date}"
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                <h1 style="color: #333; font-size: 24px; margin: 40px 0;">Attendance Update</h1>
                <p style="color: #333; font-size: 16px; line-height: 26px;">Dear {parent_name},</p>
                <p style="color: #333; font-size: 16px; line-height: 26px;">
                    This is to inform you about the attendance of your child, {student_name}, 
                    for {date}.
                </p>
                <div style="margin: 32px 0; padding: 20px; background-color: #f0f4f8; border-radius: 8px; text-align: center;">
                    <p style="color: #333; font-size: 16px;"><strong>Status:</strong></p>
                    <p style="color: {status_color}; font-size: 24px; font-weight: bold; margin-top: 8px;">{status}</p>
                </div>
                <p style="color: #333; font-size: 16px; line-height: 26px;">
                    If you have any questions about this attendance record, please contact 
                    the school administration.
                </p>
                <p style="color: #8898aa; font-size: 12px; margin-top: 32px;">
                    © {2026} {school_name}. All rights reserved.
                </p>
            </div>
        </body>
        </html>
        """
        
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                html_message=html_message,
                fail_silently=False,
            )
            logger.info(f"Attendance email sent to {recipient_email} for student {student_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to send attendance email to {recipient_email}: {str(e)}")
            return False
    
    @staticmethod
    def send_announcement_email(recipient_name, school_name, title, description, link, recipient_email):
        """
        Send announcement notification
        """
        subject = f"New Announcement from {school_name}: {title}"
        
        link_html = f'<a href="{link}" style="background-color: #5469d4; color: #fff; padding: 12px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 32px 0;">View Full Announcement</a>' if link else ""
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                <h1 style="color: #333; font-size: 24px; margin: 40px 0;">📢 New Announcement</h1>
                <p style="color: #333; font-size: 16px; line-height: 26px;">Dear {recipient_name},</p>
                <p style="color: #333; font-size: 16px; line-height: 26px;">
                    {school_name} has an important announcement for you.
                </p>
                <div style="margin: 32px 0; padding: 20px; background-color: #f0f4f8; border-radius: 8px;">
                    <p style="color: #333; font-size: 16px; margin: 8px 0;"><strong>Title:</strong> {title}</p>
                    <p style="color: #333; font-size: 16px; margin: 8px 0;"><strong>Description:</strong></p>
                    <p style="color: #333; font-size: 16px;">{description}</p>
                </div>
                {link_html}
                <p style="color: #333; font-size: 16px; line-height: 26px;">
                    Please check your dashboard for more details and updates.
                </p>
                <p style="color: #8898aa; font-size: 12px; margin-top: 32px;">
                    © {2026} {school_name}. All rights reserved.
                </p>
            </div>
        </body>
        </html>
        """
        
        plain_message = strip_tags(html_message)
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                html_message=html_message,
                fail_silently=False,
            )
            logger.info(f"Announcement email sent to {recipient_email} for {title}")
            return True
        except Exception as e:
            logger.error(f"Failed to send announcement email to {recipient_email}: {str(e)}")
            return False
