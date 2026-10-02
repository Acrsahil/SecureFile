"""
MedShare Custom Permissions
----------------------------
Simple, readable object-level permission checks.
"""

from rest_framework.permissions import BasePermission

from .models import DocumentAccess


class IsDocumentOwner(BasePermission):
    """
    Allow access only to the user who uploaded the document.
    Usage: check obj.uploaded_by == request.user
    """

    def has_object_permission(self, request, view, obj):
        return obj.uploaded_by == request.user


class HasDocumentAccess(BasePermission):
    """
    Allow access if the user is the owner OR has an explicit DocumentAccess record.
    """

    def has_object_permission(self, request, view, obj):
        if obj.uploaded_by == request.user:
            return True
        return DocumentAccess.objects.filter(document=obj, user=request.user).exists()
