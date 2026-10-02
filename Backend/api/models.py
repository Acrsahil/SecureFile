"""
MedShare Models
---------------
User (with hierarchy), Document, DocumentAccess, AccessRequest, ActivityLog
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


# ---------------------------------------------------------------------------
# Custom User Manager
# ---------------------------------------------------------------------------

class UserManager(BaseUserManager):
    """Manager that uses email as the unique identifier instead of username."""

    def create_user(self, email, full_name, password=None, role="PATIENT", **extra):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, role=role, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(email, full_name, password, role="ADMIN", **extra)


# ---------------------------------------------------------------------------
# Custom User Model — Role Hierarchy
# ---------------------------------------------------------------------------

class User(AbstractBaseUser, PermissionsMixin):
    """
    Role hierarchy:
        ADMIN           — full access, manages everyone, can access Django admin
        DOCTOR          — can manage nurses and patients assigned to them
        NURSE           — can manage patients assigned to them
        PATIENT         — basic access, manages their own documents

    assigned_to:
        - For NURSE    → points to their supervising DOCTOR
        - For PATIENT  → points to their DOCTOR or NURSE
        - For DOCTOR   → null (they are at the top below ADMIN)
        - For ADMIN    → null
    """

    ROLE_CHOICES = [
        ("ADMIN",          "Admin"),
        ("DOCTOR",         "Doctor"),
        ("NURSE",          "Nurse"),
        ("PATIENT",        "Patient"),
    ]

    email       = models.EmailField(unique=True)
    full_name   = models.CharField(max_length=150)
    role        = models.CharField(max_length=20, choices=ROLE_CHOICES, default="PATIENT")
    phone       = models.CharField(max_length=20, blank=True)

    # Extra info used by different roles
    specialty   = models.CharField(max_length=100, blank=True, help_text="For doctors: e.g. Cardiology, Radiology")

    # Hierarchy link:
    # Nurse  → supervised by a Doctor
    # Patient → cared for by a Doctor or Nurse
    assigned_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_users",
        help_text="The doctor/nurse this user is assigned to",
    )

    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)   # True for ADMIN role
    created_at  = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = UserManager()

    class Meta:
        verbose_name        = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.full_name} ({self.get_role_display()}) — {self.email}"

    def get_initials(self):
        parts = self.full_name.strip().split()
        if len(parts) >= 2:
            return (parts[0][0] + parts[-1][0]).upper()
        return self.full_name[:2].upper()

    @property
    def patient_count(self):
        """How many patients are assigned to this user (for doctors/nurses)."""
        return self.managed_users.filter(role="PATIENT").count()

    @property
    def nurse_count(self):
        """How many nurses are assigned to this doctor."""
        return self.managed_users.filter(role="NURSE").count()

    @property
    def role_rank(self):
        """Numeric rank — higher = more authority."""
        return {"ADMIN": 4, "DOCTOR": 3, "NURSE": 2, "PATIENT": 1}.get(self.role, 0)


# ---------------------------------------------------------------------------
# Document Model
# ---------------------------------------------------------------------------

class Document(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ("Prescription",      "Prescription"),
        ("Blood Test",        "Blood Test"),
        ("MRI",               "MRI"),
        ("X-Ray",             "X-Ray"),
        ("Medical Report",    "Medical Report"),
        ("Discharge Summary", "Discharge Summary"),
        ("Other",             "Other"),
    ]

    title         = models.CharField(max_length=255)
    file          = models.FileField(upload_to="documents/")
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES, default="Other")
    uploaded_by   = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        ordering            = ["-created_at"]
        verbose_name        = "Document"
        verbose_name_plural = "Documents"

    def __str__(self):
        return f"{self.title} — {self.uploaded_by.full_name}"

    def get_file_size_display(self):
        try:
            size = self.file.size
        except Exception:
            return "N/A"
        if size >= 1_000_000:
            return f"{size / 1_000_000:.1f} MB"
        return f"{max(1, round(size / 1000))} KB"

    def get_file_extension(self):
        name = self.file.name
        if "." in name:
            return name.rsplit(".", 1)[-1].upper()
        return "FILE"


# ---------------------------------------------------------------------------
# Document Access / Sharing Model
# ---------------------------------------------------------------------------

class DocumentAccess(models.Model):
    PERMISSION_CHOICES = [
        ("VIEW",     "View Only"),
        ("DOWNLOAD", "View & Download"),
    ]

    document   = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="access_records")
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="document_accesses")
    permission = models.CharField(max_length=10, choices=PERMISSION_CHOICES, default="VIEW")
    shared_by  = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="shared_documents")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together     = ("document", "user")
        verbose_name        = "Document Access"
        verbose_name_plural = "Document Accesses"

    def __str__(self):
        return f"{self.user.full_name} → {self.document.title} [{self.permission}]"


# ---------------------------------------------------------------------------
# Access Request Model
# ---------------------------------------------------------------------------

class AccessRequest(models.Model):
    STATUS_CHOICES = [
        ("PENDING",  "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    document     = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="access_requests")
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="my_access_requests")
    reason       = models.TextField(blank=True)
    status       = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together     = ("document", "requested_by")
        ordering            = ["-created_at"]
        verbose_name        = "Access Request"
        verbose_name_plural = "Access Requests"

    def __str__(self):
        return f"{self.requested_by.full_name} requested {self.document.title} [{self.status}]"


# ---------------------------------------------------------------------------
# Activity Log Model
# ---------------------------------------------------------------------------

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ("UPLOAD",           "Upload"),
        ("VIEW",             "View"),
        ("DOWNLOAD",         "Download"),
        ("SHARE",            "Share"),
        ("ACCESS_REVOKED",   "Access Revoked"),
        ("DELETE",           "Delete"),
        ("ACCESS_REQUEST",   "Access Request"),
        ("ACCESS_APPROVED",  "Access Approved"),
        ("ACCESS_REJECTED",  "Access Rejected"),
        ("ASSIGNED",         "Assigned"),
    ]

    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activity_logs")
    document    = models.ForeignKey(Document, on_delete=models.SET_NULL, null=True, blank=True, related_name="activity_logs")
    action      = models.CharField(max_length=20, choices=ACTION_CHOICES)
    description = models.CharField(max_length=500, blank=True)
    timestamp   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering            = ["-timestamp"]
        verbose_name        = "Activity Log"
        verbose_name_plural = "Activity Logs"

    def __str__(self):
        return f"{self.user.full_name} — {self.action} — {self.timestamp:%Y-%m-%d %H:%M}"
