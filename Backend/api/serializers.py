"""
MedShare Serializers
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from .models import User, Document, DocumentAccess, AccessRequest, ActivityLog


# ---------------------------------------------------------------------------
# Auth / User Serializers
# ---------------------------------------------------------------------------

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=6, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model  = User
        fields = ["id", "full_name", "email", "role", "password", "password2"]

    def validate_role(self, value):
        # ADMIN accounts must be created through Django admin, not self-registration
        if value == "ADMIN":
            raise serializers.ValidationError("Admin accounts cannot be self-registered.")
        return value

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    """Safe user info returned to the frontend."""
    initials          = serializers.SerializerMethodField()
    patient_count     = serializers.SerializerMethodField()
    nurse_count       = serializers.SerializerMethodField()
    assigned_to_name  = serializers.SerializerMethodField()
    role_display      = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            "id", "full_name", "email", "role", "role_display",
            "phone", "specialty",
            "assigned_to", "assigned_to_name",
            "patient_count", "nurse_count",
            "created_at", "initials",
        ]
        read_only_fields = ["id", "created_at", "initials"]

    def get_initials(self, obj):         return obj.get_initials()
    def get_patient_count(self, obj):    return obj.patient_count
    def get_nurse_count(self, obj):      return obj.nurse_count
    def get_role_display(self, obj):     return obj.get_role_display()
    def get_assigned_to_name(self, obj):
        return obj.assigned_to.full_name if obj.assigned_to else None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Fields the user is allowed to update themselves (NOT role)."""
    class Meta:
        model  = User
        fields = ["full_name", "email", "phone", "specialty"]


# ---------------------------------------------------------------------------
# Document Serializers
# ---------------------------------------------------------------------------

class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source="uploaded_by.full_name", read_only=True)
    file_size        = serializers.SerializerMethodField()
    file_extension   = serializers.SerializerMethodField()
    is_owner         = serializers.SerializerMethodField()

    class Meta:
        model  = Document
        fields = [
            "id", "title", "file", "document_type",
            "uploaded_by", "uploaded_by_name",
            "file_size", "file_extension",
            "created_at", "updated_at", "is_owner",
        ]
        read_only_fields = ["id", "uploaded_by", "created_at", "updated_at"]

    def get_file_size(self, obj):      return obj.get_file_size_display()
    def get_file_extension(self, obj): return obj.get_file_extension()
    def get_is_owner(self, obj):
        request = self.context.get("request")
        return bool(request and request.user.is_authenticated and obj.uploaded_by == request.user)


class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Document
        fields = ["title", "document_type", "file"]


# ---------------------------------------------------------------------------
# Document Access Serializers
# ---------------------------------------------------------------------------

class DocumentAccessSerializer(serializers.ModelSerializer):
    user_name      = serializers.CharField(source="user.full_name",     read_only=True)
    user_email     = serializers.CharField(source="user.email",         read_only=True)
    shared_by_name = serializers.CharField(source="shared_by.full_name", read_only=True)

    class Meta:
        model  = DocumentAccess
        fields = ["id", "document", "user", "user_name", "user_email",
                  "permission", "shared_by", "shared_by_name", "created_at"]
        read_only_fields = ["id", "document", "shared_by", "created_at"]


class ShareDocumentSerializer(serializers.Serializer):
    user_id    = serializers.IntegerField()
    permission = serializers.ChoiceField(choices=["VIEW", "DOWNLOAD"])

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User not found.")
        return value


# ---------------------------------------------------------------------------
# Shared With Me
# ---------------------------------------------------------------------------

class SharedWithMeSerializer(serializers.ModelSerializer):
    document_id    = serializers.IntegerField(source="document.id",          read_only=True)
    title          = serializers.CharField(source="document.title",          read_only=True)
    document_type  = serializers.CharField(source="document.document_type",  read_only=True)
    file_size      = serializers.SerializerMethodField()
    file_extension = serializers.SerializerMethodField()
    shared_by      = serializers.CharField(source="shared_by.full_name",     read_only=True)
    shared_by_email= serializers.CharField(source="shared_by.email",         read_only=True)

    class Meta:
        model  = DocumentAccess
        fields = ["id", "document_id", "title", "document_type",
                  "file_size", "file_extension",
                  "permission", "shared_by", "shared_by_email", "created_at"]

    def get_file_size(self, obj):      return obj.document.get_file_size_display()
    def get_file_extension(self, obj): return obj.document.get_file_extension()


# ---------------------------------------------------------------------------
# Access Request Serializers
# ---------------------------------------------------------------------------

class AccessRequestSerializer(serializers.ModelSerializer):
    requested_by_name  = serializers.CharField(source="requested_by.full_name", read_only=True)
    requested_by_email = serializers.CharField(source="requested_by.email",     read_only=True)
    document_title     = serializers.CharField(source="document.title",         read_only=True)
    document_id        = serializers.IntegerField(source="document.id",         read_only=True)

    class Meta:
        model  = AccessRequest
        fields = ["id", "document", "document_id", "document_title",
                  "requested_by", "requested_by_name", "requested_by_email",
                  "reason", "status", "created_at"]
        read_only_fields = ["id", "requested_by", "status", "created_at"]


class CreateAccessRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AccessRequest
        fields = ["document", "reason"]


# ---------------------------------------------------------------------------
# Activity Log Serializer
# ---------------------------------------------------------------------------

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name      = serializers.CharField(source="user.full_name", read_only=True)
    document_title = serializers.SerializerMethodField()

    class Meta:
        model  = ActivityLog
        fields = ["id", "user_name", "document", "document_title",
                  "action", "description", "timestamp"]

    def get_document_title(self, obj):
        return obj.document.title if obj.document else None


# ---------------------------------------------------------------------------
# Patient / Staff Management Serializers
# ---------------------------------------------------------------------------

class PatientSerializer(serializers.ModelSerializer):
    """Compact user card used in the My Patients list."""
    initials          = serializers.SerializerMethodField()
    role_display      = serializers.SerializerMethodField()
    assigned_to_name  = serializers.SerializerMethodField()
    document_count    = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            "id", "full_name", "email", "role", "role_display",
            "phone", "specialty", "initials",
            "assigned_to", "assigned_to_name",
            "document_count", "created_at",
        ]

    def get_initials(self, obj):         return obj.get_initials()
    def get_role_display(self, obj):     return obj.get_role_display()
    def get_assigned_to_name(self, obj):
        return obj.assigned_to.full_name if obj.assigned_to else None
    def get_document_count(self, obj):   return obj.documents.count()


class AssignUserSerializer(serializers.Serializer):
    """Assign a patient/nurse to a doctor/nurse."""
    assigned_to_id = serializers.IntegerField(allow_null=True)

    def validate_assigned_to_id(self, value):
        if value is not None:
            try:
                user = User.objects.get(id=value)
                if user.role not in ("DOCTOR", "NURSE", "ADMIN"):
                    raise serializers.ValidationError("Can only assign to a Doctor, Nurse, or Admin.")
            except User.DoesNotExist:
                raise serializers.ValidationError("User not found.")
        return value
