"""
MedShare Django Admin Configuration
-------------------------------------
Register all models so the project is easy to demonstrate.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, Document, DocumentAccess, AccessRequest, ActivityLog


# ---------------------------------------------------------------------------
# Custom User Admin
# ---------------------------------------------------------------------------

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin view for our custom email-based User model."""

    list_display = ("email", "full_name", "role", "assigned_to", "is_active", "is_staff", "created_at")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("email", "full_name", "phone", "specialty")
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("full_name", "role", "specialty", "phone", "assigned_to")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("created_at", "last_login")}),
    )
    readonly_fields = ("created_at", "last_login")

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "full_name", "role", "specialty", "phone", "assigned_to", "password1", "password2"),
            },
        ),
    )


# ---------------------------------------------------------------------------
# Document Admin
# ---------------------------------------------------------------------------

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    """Admin view for uploaded medical documents."""

    list_display = ("title", "document_type", "uploaded_by", "created_at")
    list_filter = ("document_type",)
    search_fields = ("title", "uploaded_by__full_name", "uploaded_by__email")
    ordering = ("-created_at",)
    raw_id_fields = ("uploaded_by",)


# ---------------------------------------------------------------------------
# Document Access Admin
# ---------------------------------------------------------------------------

@admin.register(DocumentAccess)
class DocumentAccessAdmin(admin.ModelAdmin):
    """Admin view for document sharing records."""

    list_display = ("document", "user", "permission", "shared_by", "created_at")
    list_filter = ("permission",)
    search_fields = ("document__title", "user__full_name", "user__email")
    ordering = ("-created_at",)
    raw_id_fields = ("document", "user", "shared_by")


# ---------------------------------------------------------------------------
# Access Request Admin
# ---------------------------------------------------------------------------

@admin.register(AccessRequest)
class AccessRequestAdmin(admin.ModelAdmin):
    """Admin view for access requests."""

    list_display = ("document", "requested_by", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("document__title", "requested_by__full_name", "requested_by__email")
    ordering = ("-created_at",)
    raw_id_fields = ("document", "requested_by")


# ---------------------------------------------------------------------------
# Activity Log Admin
# ---------------------------------------------------------------------------

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    """Admin view for audit logs — read-only."""

    list_display = ("user", "action", "document", "description", "timestamp")
    list_filter = ("action",)
    search_fields = ("user__full_name", "user__email", "document__title", "description")
    ordering = ("-timestamp",)
    raw_id_fields = ("user", "document")

    def has_add_permission(self, request):
        return False  # Logs should not be added manually

    def has_change_permission(self, request, obj=None):
        return False  # Logs should not be edited
