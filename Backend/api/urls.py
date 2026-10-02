"""
MedShare API URL Patterns
--------------------------
Clean URL structure matching the frontend's API calls.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    # -----------------------------------------------------------------------
    # Auth
    # -----------------------------------------------------------------------
    path("auth/register/", views.register, name="register"),
    path("auth/login/", views.login_view, name="login"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # -----------------------------------------------------------------------
    # Profile
    # -----------------------------------------------------------------------
    path("profile/", views.profile, name="profile"),

    # -----------------------------------------------------------------------
    # Dashboard
    # -----------------------------------------------------------------------
    path("dashboard/", views.dashboard, name="dashboard"),

    # -----------------------------------------------------------------------
    # Documents
    # -----------------------------------------------------------------------
    path("documents/", views.document_list, name="document-list"),
    path("documents/<int:pk>/", views.document_detail, name="document-detail"),
    path("documents/<int:pk>/file/", views.document_file, name="document-file"),
    path("documents/<int:pk>/share/", views.share_document, name="document-share"),
    path("documents/<int:pk>/access/", views.document_access_list, name="document-access-list"),
    path("documents/<int:pk>/access/<int:user_id>/", views.revoke_access, name="revoke-access"),

    # -----------------------------------------------------------------------
    # Shared With Me
    # -----------------------------------------------------------------------
    path("shared-with-me/", views.shared_with_me, name="shared-with-me"),

    # -----------------------------------------------------------------------
    # Access Requests
    # -----------------------------------------------------------------------
    path("access-requests/", views.access_requests, name="access-requests"),
    path("access-requests/<int:pk>/approve/", views.approve_access_request, name="approve-request"),
    path("access-requests/<int:pk>/reject/", views.reject_access_request, name="reject-request"),

    # -----------------------------------------------------------------------
    # Activity Log
    # -----------------------------------------------------------------------
    path("activity/", views.activity_log, name="activity-log"),

    # -----------------------------------------------------------------------
    # Users (for share dropdown)
    # -----------------------------------------------------------------------
    path("users/", views.users_list, name="users-list"),
    path("users/<int:pk>/assign/", views.assign_user, name="assign-user"),

    # -----------------------------------------------------------------------
    # Hierarchy
    # -----------------------------------------------------------------------
    path("my-patients/", views.my_patients, name="my-patients"),
    path("staff-list/", views.staff_list, name="staff-list"),
]
