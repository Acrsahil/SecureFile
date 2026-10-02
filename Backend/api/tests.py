"""
MedShare API Tests
-------------------
Basic smoke tests to verify the core flows work.
Run with: python manage.py test api
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import User, Document, DocumentAccess


class AuthTests(TestCase):
    """Test registration and login."""

    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        response = self.client.post("/api/auth/register/", {
            "full_name": "Test Patient",
            "email": "patient@test.com",
            "role": "PATIENT",
            "password": "testpass123",
            "password2": "testpass123",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertIn("access", response.data["data"])

    def test_login(self):
        User.objects.create_user(
            email="doctor@test.com",
            full_name="Dr. Test",
            password="testpass123",
        )
        response = self.client.post("/api/auth/login/", {
            "email": "doctor@test.com",
            "password": "testpass123",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data["data"])

    def test_login_wrong_password(self):
        User.objects.create_user(
            email="wrong@test.com",
            full_name="Wrong User",
            password="correct",
        )
        response = self.client.post("/api/auth/login/", {
            "email": "wrong@test.com",
            "password": "incorrect",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class DocumentTests(TestCase):
    """Test document access control."""

    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email="owner@test.com",
            full_name="Doc Owner",
            password="pass123",
        )
        self.other = User.objects.create_user(
            email="other@test.com",
            full_name="Other User",
            password="pass123",
        )
        # Login as owner
        res = self.client.post("/api/auth/login/", {
            "email": "owner@test.com",
            "password": "pass123",
        }, format="json")
        self.owner_token = res.data["data"]["access"]

        res = self.client.post("/api/auth/login/", {
            "email": "other@test.com",
            "password": "pass123",
        }, format="json")
        self.other_token = res.data["data"]["access"]

    def _auth(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_unauthenticated_access_returns_401(self):
        self.client.credentials()  # clear auth
        response = self.client.get("/api/documents/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_owner_can_list_documents(self):
        self._auth(self.owner_token)
        response = self.client.get("/api/documents/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthorized_user_cannot_access_document(self):
        # Create a document as owner
        doc = Document.objects.create(
            title="Private Report",
            document_type="Blood Test",
            uploaded_by=self.owner,
            file="documents/test.pdf",
        )
        self._auth(self.other_token)
        response = self.client.get(f"/api/documents/{doc.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_can_access_document(self):
        doc = Document.objects.create(
            title="Shared Report",
            document_type="MRI",
            uploaded_by=self.owner,
            file="documents/test.pdf",
        )
        # Grant access
        DocumentAccess.objects.create(
            document=doc,
            user=self.other,
            permission="VIEW",
            shared_by=self.owner,
        )
        self._auth(self.other_token)
        response = self.client.get(f"/api/documents/{doc.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_only_owner_can_delete(self):
        doc = Document.objects.create(
            title="Delete Test",
            document_type="X-Ray",
            uploaded_by=self.owner,
            file="documents/test.pdf",
        )
        DocumentAccess.objects.create(
            document=doc,
            user=self.other,
            permission="DOWNLOAD",
            shared_by=self.owner,
        )
        # Other user tries to delete
        self._auth(self.other_token)
        response = self.client.delete(f"/api/documents/{doc.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Owner can delete
        self._auth(self.owner_token)
        response = self.client.delete(f"/api/documents/{doc.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
