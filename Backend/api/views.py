"""
MedShare API Views
-------------------
All API endpoints in one file, organized by feature.
Authentication → Documents → Sharing → Access Requests → Activity → Dashboard
"""

from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes, authentication_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Document, DocumentAccess, AccessRequest, ActivityLog
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileUpdateSerializer,
    DocumentSerializer,
    DocumentUploadSerializer,
    DocumentAccessSerializer,
    ShareDocumentSerializer,
    SharedWithMeSerializer,
    AccessRequestSerializer,
    CreateAccessRequestSerializer,
    ActivityLogSerializer,
    PatientSerializer,
    AssignUserSerializer,
)


# ---------------------------------------------------------------------------
# Helper — consistent response format
# ---------------------------------------------------------------------------

def success(data=None, message="Success", status_code=status.HTTP_200_OK):
    """Return a consistent success response."""
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return Response(payload, status=status_code)


def error(message="An error occurred", status_code=status.HTTP_400_BAD_REQUEST, errors=None):
    """Return a consistent error response."""
    payload = {"success": False, "message": message}
    if errors:
        payload["errors"] = errors
    return Response(payload, status=status_code)


def log_activity(user, action, document=None, description=""):
    """Helper to create an ActivityLog entry in one line."""
    ActivityLog.objects.create(
        user=user,
        action=action,
        document=document,
        description=description,
    )


# ===========================================================================
# AUTH VIEWS
# ===========================================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    """
    POST /api/auth/register/
    Create a new user account.
    """
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return error("Registration failed.", errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    user_data = UserSerializer(user).data

    return success(
        data={
            "user": user_data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        message="Account created successfully.",
        status_code=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    """
    POST /api/auth/login/
    Login with email + password, returns JWT tokens and user info.
    """
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")

    if not email or not password:
        return error("Email and password are required.")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return error("Invalid email or password.", status_code=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return error("Invalid email or password.", status_code=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return error("Your account is disabled.", status_code=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    user_data = UserSerializer(user).data

    return success(
        data={
            "user": user_data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        message="Login successful.",
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    POST /api/auth/logout/
    Blacklist the refresh token (simple logout).
    """
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
    except Exception:
        pass  # Even if blacklisting fails, the client should clear tokens

    return success(message="Logged out successfully.")


# ===========================================================================
# PROFILE VIEWS
# ===========================================================================

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    GET  /api/profile/  — view own profile
    PUT  /api/profile/  — update full_name and email
    """
    user = request.user

    if request.method == "GET":
        return success(data=UserSerializer(user).data)

    # PUT — update profile
    serializer = ProfileUpdateSerializer(user, data=request.data, partial=True)
    if not serializer.is_valid():
        return error("Profile update failed.", errors=serializer.errors)

    serializer.save()
    return success(data=UserSerializer(user).data, message="Profile updated successfully.")


# ===========================================================================
# DOCUMENT VIEWS
# ===========================================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def document_list(request):
    """
    GET  /api/documents/  — list documents owned by the current user
    POST /api/documents/  — upload a new document
    """
    if request.method == "GET":
        docs = Document.objects.filter(uploaded_by=request.user)
        serializer = DocumentSerializer(docs, many=True, context={"request": request})
        return success(data=serializer.data)

    # POST — upload
    serializer = DocumentUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return error("Upload failed.", errors=serializer.errors)

    # The backend sets uploaded_by from the authenticated user — never from frontend
    document = serializer.save(uploaded_by=request.user)

    log_activity(
        user=request.user,
        action="UPLOAD",
        document=document,
        description=f"{request.user.full_name} uploaded {document.title}",
    )

    return success(
        data=DocumentSerializer(document, context={"request": request}).data,
        message="Document uploaded successfully.",
        status_code=status.HTTP_201_CREATED,
    )


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def document_detail(request, pk):
    """
    GET    /api/documents/<id>/  — view document detail (owner or authorized)
    DELETE /api/documents/<id>/  — delete document (owner only)
    """
    document = get_object_or_404(Document, pk=pk)

    # Check if the user has any access (owner or DocumentAccess record)
    is_owner = document.uploaded_by == request.user
    has_access = DocumentAccess.objects.filter(document=document, user=request.user).exists()

    if not (is_owner or has_access):
        return error(
            "You do not have permission to access this document.",
            status_code=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "GET":
        if not is_owner:
            # Log view access for authorized users
            log_activity(
                user=request.user,
                action="VIEW",
                document=document,
                description=f"{request.user.full_name} viewed {document.title}",
            )
        return success(data=DocumentSerializer(document, context={"request": request}).data)

    # DELETE — owner only
    if not is_owner:
        return error("Only the document owner can delete it.", status_code=status.HTTP_403_FORBIDDEN)

    title = document.title
    log_activity(
        user=request.user,
        action="DELETE",
        document=None,
        description=f"{request.user.full_name} deleted {title}",
    )
    document.delete()
    return success(message=f'"{title}" has been deleted.')


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def document_file(request, pk):
    """
    GET /api/documents/<id>/file/
    Serve the actual file — but only after authorization check.
    The URL alone is NOT enough — the user must be authenticated and authorized.
    """
    document = get_object_or_404(Document, pk=pk)

    is_owner = document.uploaded_by == request.user
    access_record = None

    if not is_owner:
        try:
            access_record = DocumentAccess.objects.get(document=document, user=request.user)
        except DocumentAccess.DoesNotExist:
            return error(
                "You do not have permission to access this document.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

    # Determine action to log
    action = "VIEW"
    # If the request has ?download=1 query param, check DOWNLOAD permission
    wants_download = request.query_params.get("download") == "1"
    if wants_download and not is_owner:
        if access_record and access_record.permission != "DOWNLOAD":
            return error(
                "You only have View permission for this document.",
                status_code=status.HTTP_403_FORBIDDEN,
            )
        action = "DOWNLOAD"

    # Log the action
    log_activity(
        user=request.user,
        action=action,
        document=document,
        description=f"{request.user.full_name} {'downloaded' if action == 'DOWNLOAD' else 'viewed'} {document.title}",
    )

    # Stream the file
    try:
        response = FileResponse(document.file.open("rb"), as_attachment=wants_download)
        response["Content-Disposition"] = (
            f'{"attachment" if wants_download else "inline"}; filename="{document.file.name.split("/")[-1]}"'
        )
        return response
    except Exception:
        return error("File not found on server.", status_code=status.HTTP_404_NOT_FOUND)


# ===========================================================================
# SHARING / ACCESS MANAGEMENT VIEWS
# ===========================================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def share_document(request, pk):
    """
    POST /api/documents/<id>/share/
    Share a document with another user. Only the owner can share.

    Body: { "user_id": 5, "permission": "VIEW" }
    """
    document = get_object_or_404(Document, pk=pk)

    if document.uploaded_by != request.user:
        return error("Only the document owner can share it.", status_code=status.HTTP_403_FORBIDDEN)

    serializer = ShareDocumentSerializer(data=request.data)
    if not serializer.is_valid():
        return error("Invalid share data.", errors=serializer.errors)

    target_user_id = serializer.validated_data["user_id"]
    permission = serializer.validated_data["permission"]

    # Cannot share with yourself
    if target_user_id == request.user.id:
        return error("You cannot share a document with yourself.")

    target_user = get_object_or_404(User, pk=target_user_id)

    # Create or update the access record
    access, created = DocumentAccess.objects.update_or_create(
        document=document,
        user=target_user,
        defaults={"permission": permission, "shared_by": request.user},
    )

    action_word = "shared" if created else "updated access for"
    log_activity(
        user=request.user,
        action="SHARE",
        document=document,
        description=f"{request.user.full_name} {action_word} {document.title} with {target_user.full_name} [{permission}]",
    )

    return success(
        data=DocumentAccessSerializer(access).data,
        message=f"Document {'shared with' if created else 'access updated for'} {target_user.full_name}.",
        status_code=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def document_access_list(request, pk):
    """
    GET /api/documents/<id>/access/
    List all users who have access to this document.
    Only the document owner can see this list.
    """
    document = get_object_or_404(Document, pk=pk)

    if document.uploaded_by != request.user:
        return error("Only the document owner can view the access list.", status_code=status.HTTP_403_FORBIDDEN)

    access_records = DocumentAccess.objects.filter(document=document).select_related("user", "shared_by")
    serializer = DocumentAccessSerializer(access_records, many=True)
    return success(data=serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def revoke_access(request, pk, user_id):
    """
    DELETE /api/documents/<id>/access/<user_id>/
    Revoke a specific user's access. Only the document owner can revoke.
    """
    document = get_object_or_404(Document, pk=pk)

    if document.uploaded_by != request.user:
        return error("Only the document owner can revoke access.", status_code=status.HTTP_403_FORBIDDEN)

    target_user = get_object_or_404(User, pk=user_id)
    access = get_object_or_404(DocumentAccess, document=document, user=target_user)

    access.delete()

    log_activity(
        user=request.user,
        action="ACCESS_REVOKED",
        document=document,
        description=f"{request.user.full_name} revoked {target_user.full_name}'s access to {document.title}",
    )

    return success(message=f"Access revoked for {target_user.full_name}.")


# ===========================================================================
# SHARED WITH ME
# ===========================================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def shared_with_me(request):
    """
    GET /api/shared-with-me/
    Return all documents that have been shared with the current user.
    """
    access_records = (
        DocumentAccess.objects.filter(user=request.user)
        .select_related("document", "shared_by", "document__uploaded_by")
        .order_by("-created_at")
    )
    serializer = SharedWithMeSerializer(access_records, many=True)
    return success(data=serializer.data)


# ===========================================================================
# ACCESS REQUESTS
# ===========================================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def access_requests(request):
    """
    GET  /api/access-requests/  — list requests (own requests + requests on my documents)
    POST /api/access-requests/  — request access to a document
    """
    if request.method == "GET":
        # Requests made by the current user
        my_requests = AccessRequest.objects.filter(requested_by=request.user).select_related("document", "requested_by")
        # Requests on documents I own
        requests_on_my_docs = AccessRequest.objects.filter(
            document__uploaded_by=request.user
        ).exclude(requested_by=request.user).select_related("document", "requested_by")

        return success(
            data={
                "my_requests": AccessRequestSerializer(my_requests, many=True).data,
                "incoming_requests": AccessRequestSerializer(requests_on_my_docs, many=True).data,
            }
        )

    # POST — create access request
    serializer = CreateAccessRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return error("Invalid request.", errors=serializer.errors)

    document = serializer.validated_data["document"]

    # Don't allow owner to request access to their own document
    if document.uploaded_by == request.user:
        return error("You already own this document.")

    # Check if a request already exists
    if AccessRequest.objects.filter(document=document, requested_by=request.user).exists():
        return error("You already have a pending request for this document.")

    access_request = serializer.save(requested_by=request.user)

    log_activity(
        user=request.user,
        action="ACCESS_REQUEST",
        document=document,
        description=f"{request.user.full_name} requested access to {document.title}",
    )

    return success(
        data=AccessRequestSerializer(access_request).data,
        message="Access request submitted.",
        status_code=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_access_request(request, pk):
    """
    POST /api/access-requests/<id>/approve/
    Approve an access request. Only the document owner can approve.
    When approved, a DocumentAccess record is automatically created.
    """
    access_request = get_object_or_404(AccessRequest, pk=pk)
    document = access_request.document

    if document.uploaded_by != request.user:
        return error("Only the document owner can approve requests.", status_code=status.HTTP_403_FORBIDDEN)

    if access_request.status != "PENDING":
        return error(f"This request is already {access_request.status}.")

    # Default to VIEW permission unless specified
    permission = request.data.get("permission", "VIEW")
    if permission not in ["VIEW", "DOWNLOAD"]:
        permission = "VIEW"

    access_request.status = "APPROVED"
    access_request.save()

    # Automatically create the DocumentAccess record
    DocumentAccess.objects.update_or_create(
        document=document,
        user=access_request.requested_by,
        defaults={"permission": permission, "shared_by": request.user},
    )

    log_activity(
        user=request.user,
        action="ACCESS_APPROVED",
        document=document,
        description=f"{request.user.full_name} approved {access_request.requested_by.full_name}'s request for {document.title}",
    )

    return success(message=f"Access approved for {access_request.requested_by.full_name}.")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_access_request(request, pk):
    """
    POST /api/access-requests/<id>/reject/
    Reject an access request. Only the document owner can reject.
    """
    access_request = get_object_or_404(AccessRequest, pk=pk)
    document = access_request.document

    if document.uploaded_by != request.user:
        return error("Only the document owner can reject requests.", status_code=status.HTTP_403_FORBIDDEN)

    if access_request.status != "PENDING":
        return error(f"This request is already {access_request.status}.")

    access_request.status = "REJECTED"
    access_request.save()

    log_activity(
        user=request.user,
        action="ACCESS_REJECTED",
        document=document,
        description=f"{request.user.full_name} rejected {access_request.requested_by.full_name}'s request for {document.title}",
    )

    return success(message="Access request rejected.")


# ===========================================================================
# ACTIVITY LOG
# ===========================================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def activity_log(request):
    """
    GET /api/activity/
    Return recent activity for the current user.
    """
    logs = ActivityLog.objects.filter(user=request.user).select_related("document")[:50]
    serializer = ActivityLogSerializer(logs, many=True)
    return success(data=serializer.data)


# ===========================================================================
# DASHBOARD
# ===========================================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    """
    GET /api/dashboard/
    Return summary statistics + recent documents + recent activity.
    """
    user = request.user

    # --- Statistics ---
    total_documents = Document.objects.filter(uploaded_by=user).count()

    # Documents shared by me (that have at least one DocumentAccess record)
    shared_documents = (
        Document.objects.filter(uploaded_by=user, access_records__isnull=False)
        .distinct()
        .count()
    )

    # Documents shared with me
    received_documents = DocumentAccess.objects.filter(user=user).count()

    # Pending access requests on my documents
    pending_requests = AccessRequest.objects.filter(
        document__uploaded_by=user, status="PENDING"
    ).count()

    # --- Recent documents (last 5) ---
    recent_docs = Document.objects.filter(uploaded_by=user).order_by("-created_at")[:5]
    recent_docs_data = DocumentSerializer(recent_docs, many=True, context={"request": request}).data

    # --- Recent activity (last 10) ---
    recent_activity = ActivityLog.objects.filter(user=user).order_by("-timestamp")[:10]
    recent_activity_data = ActivityLogSerializer(recent_activity, many=True).data

    return success(
        data={
            "stats": {
                "total_documents": total_documents,
                "shared_documents": shared_documents,
                "received_documents": received_documents,
                "pending_requests": pending_requests,
            },
            "recent_documents": recent_docs_data,
            "recent_activity": recent_activity_data,
        }
    )


# ===========================================================================
# USERS LIST (for share dropdown)
# ===========================================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request):
    """
    GET /api/users/
    Return a list of all users (excluding the current user).
    Used by the frontend share dropdown.
    """
    users = User.objects.exclude(id=request.user.id).filter(is_active=True)
    serializer = UserSerializer(users, many=True)
    return success(data=serializer.data)


# ===========================================================================
# HIERARCHY / TEAM MANAGEMENT
# ===========================================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_patients(request):
    """
    GET /api/my-patients/
    Return patients assigned to the current DOCTOR or NURSE.
    Admins can see all patients.
    """
    user = request.user
    if user.role == "PATIENT":
        return error("Patients do not manage other patients.", status_code=status.HTTP_403_FORBIDDEN)
    
    if user.role == "ADMIN":
        patients = User.objects.filter(role="PATIENT", is_active=True)
    else:
        patients = User.objects.filter(assigned_to=user, role="PATIENT", is_active=True)
        
    serializer = PatientSerializer(patients, many=True)
    return success(data=serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unassigned_patients(request):
    """
    GET /api/unassigned-patients/
    Return patients that have no assigned doctor/nurse.
    """
    user = request.user
    if user.role not in ["DOCTOR", "NURSE", "ADMIN"]:
        return error("Permission denied.", status_code=status.HTTP_403_FORBIDDEN)
    
    # Exclude admins/doctors/nurses, only get unassigned PATIENTS
    patients = User.objects.filter(role="PATIENT", assigned_to__isnull=True, is_active=True)
    serializer = PatientSerializer(patients, many=True)
    return success(data=serializer.data)


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def staff_list(request):
    """
    GET /api/staff-list/
    Return list of doctors and nurses. Useful for assignment dropdowns.
    """
    # Anyone can see staff (to know who to share with, or assign to)
    staff = User.objects.filter(role__in=["DOCTOR", "NURSE", "ADMIN"], is_active=True)
    serializer = UserSerializer(staff, many=True)
    return success(data=serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_user(request, pk):
    """
    POST /api/users/<pk>/assign/
    Assign a patient/nurse to a doctor/nurse.
    Body: { "assigned_to_id": 5 } or { "assigned_to_id": null }
    """
    user = request.user
    target_user = get_object_or_404(User, pk=pk)
    
    # Check permissions
    if user.role == "PATIENT":
        return error("Patients cannot assign roles.", status_code=status.HTTP_403_FORBIDDEN)
        
    if user.role == "NURSE" and target_user.role != "PATIENT":
        return error("Nurses can only assign patients.", status_code=status.HTTP_403_FORBIDDEN)

    serializer = AssignUserSerializer(data=request.data)
    if not serializer.is_valid():
        return error("Invalid assignment data.", errors=serializer.errors)
        
    assigned_to_id = serializer.validated_data["assigned_to_id"]
    
    assigned_to_user = None
    if assigned_to_id:
        assigned_to_user = User.objects.get(id=assigned_to_id)
        
    target_user.assigned_to = assigned_to_user
    target_user.save()
    
    log_activity(
        user=user,
        action="ASSIGNED",
        description=f"{user.full_name} assigned {target_user.full_name} to {assigned_to_user.full_name if assigned_to_user else 'Unassigned'}"
    )
    
    return success(message=f"Successfully assigned {target_user.full_name}.")
