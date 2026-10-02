# MedShare — Backend

Django REST API backend for the MedShare Secure Medical File Sharing Platform.

---

## Tech Stack

- **Python 3.x** + **Django 6.x**
- **Django REST Framework** (DRF)
- **djangorestframework-simplejwt** (JWT authentication)
- **django-cors-headers** (CORS for React frontend)
- **SQLite** (default Django database)
- **Pillow** (file handling)

---

## Project Structure

```
Backend/
├── manage.py
├── db.sqlite3
├── requirements.txt
├── media/
│   └── documents/       ← uploaded files stored here
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── api/
    ├── migrations/
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── serializers.py
    ├── permissions.py
    ├── urls.py
    ├── views.py
    └── tests.py
```

---

## Setup Instructions

### 1. Create and activate virtual environment

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run database migrations

```bash
python manage.py migrate
```

### 4. Create a superuser (for Django Admin)

```bash
python manage.py createsuperuser
```

Enter email, full name, and password when prompted.

### 5. Start the development server

```bash
python manage.py runserver
```

The API will be available at: `http://127.0.0.1:8000/`

Django Admin: `http://127.0.0.1:8000/admin/`

---

## Connecting the React Frontend

The React frontend (Vite) runs on `http://localhost:5173` by default.  
CORS is already configured in `config/settings.py` to allow this origin.

In the frontend, set the API base URL to:

```
http://127.0.0.1:8000/api/
```

Store the JWT `access` token in `localStorage` and send it as:

```
Authorization: Bearer <access_token>
```

---

## API Endpoints

### Authentication

| Method | URL                        | Description                       |
| ------ | -------------------------- | --------------------------------- |
| POST   | `/api/auth/register/`      | Register a new user               |
| POST   | `/api/auth/login/`         | Login, returns JWT tokens         |
| POST   | `/api/auth/logout/`        | Logout (blacklists refresh token) |
| POST   | `/api/auth/token/refresh/` | Refresh JWT access token          |

### Profile

| Method | URL             | Description                       |
| ------ | --------------- | --------------------------------- |
| GET    | `/api/profile/` | View own profile                  |
| PUT    | `/api/profile/` | Update profile (full_name, email) |

### Dashboard

| Method | URL               | Description                                |
| ------ | ----------------- | ------------------------------------------ |
| GET    | `/api/dashboard/` | Stats + recent documents + recent activity |

### Documents

| Method | URL                                    | Description                                      |
| ------ | -------------------------------------- | ------------------------------------------------ |
| GET    | `/api/documents/`                      | List my documents                                |
| POST   | `/api/documents/`                      | Upload a document (multipart/form-data)          |
| GET    | `/api/documents/<id>/`                 | View document detail                             |
| DELETE | `/api/documents/<id>/`                 | Delete document (owner only)                     |
| GET    | `/api/documents/<id>/file/`            | Stream/view the file (auth required)             |
| GET    | `/api/documents/<id>/file/?download=1` | Download the file (DOWNLOAD permission required) |

### Sharing / Access Control

| Method | URL                                     | Description                      |
| ------ | --------------------------------------- | -------------------------------- |
| POST   | `/api/documents/<id>/share/`            | Share document with a user       |
| GET    | `/api/documents/<id>/access/`           | List who has access (owner only) |
| DELETE | `/api/documents/<id>/access/<user_id>/` | Revoke access (owner only)       |

### Shared With Me

| Method | URL                    | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| GET    | `/api/shared-with-me/` | Documents shared with the current user |

### Access Requests

| Method | URL                                  | Description                                |
| ------ | ------------------------------------ | ------------------------------------------ |
| GET    | `/api/access-requests/`              | My requests + incoming requests on my docs |
| POST   | `/api/access-requests/`              | Request access to a document               |
| POST   | `/api/access-requests/<id>/approve/` | Approve request (owner only)               |
| POST   | `/api/access-requests/<id>/reject/`  | Reject request (owner only)                |

### Activity Log

| Method | URL              | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/api/activity/` | Recent activity for the current user |

### Users

| Method | URL           | Description                         |
| ------ | ------------- | ----------------------------------- |
| GET    | `/api/users/` | List all users (for share dropdown) |

---

## Request/Response Format

### Register

```json
POST /api/auth/register/
{
  "full_name": "Sahil Acharya",
  "email": "sahil@example.com",
  "role": "PATIENT",
  "password": "securepass",
  "password2": "securepass"
}
```

### Login

```json
POST /api/auth/login/
{
  "email": "sahil@example.com",
  "password": "securepass"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "full_name": "Sahil Acharya",
      "email": "...",
      "role": "PATIENT"
    },
    "access": "<jwt_access_token>",
    "refresh": "<jwt_refresh_token>"
  }
}
```

### Upload Document

```
POST /api/documents/
Content-Type: multipart/form-data

title: Blood Test Report
document_type: Blood Test
file: <file>
```

### Share Document

```json
POST /api/documents/1/share/
{
  "user_id": 2,
  "permission": "VIEW"
}
```

---

## User Roles

| Role           | Value            |
| -------------- | ---------------- |
| Patient        | `PATIENT`        |
| Doctor         | `DOCTOR`         |
| Hospital Staff | `HOSPITAL_STAFF` |

---

## Access Control Rules

- **Owner**: Can upload, view, share, revoke, delete
- **VIEW permission**: Can view document details and file (no download)
- **DOWNLOAD permission**: Can view and download the file
- **No permission**: Gets `403 Forbidden`
- **Not logged in**: Gets `401 Unauthorized`

---

## Demonstration Flow

```
1. Register two users (e.g., Sahil as Patient, Dr. Sharma as Doctor)
2. Login as Sahil
3. Upload a medical document (Blood Test Report)
4. Share it with Dr. Sharma (VIEW permission)
5. Logout
6. Login as Dr. Sharma
7. Go to "Shared With Me" → see Blood Test Report
8. Try to download → blocked (only VIEW)
9. Logout, login as Sahil
10. Grant DOWNLOAD permission
11. Login as Dr. Sharma → now can download
12. Sahil can revoke access anytime
13. Check Activity Log — every action is recorded
14. Try accessing without login → 401
15. Try accessing another user's document → 403
```

---

## Django Admin

Visit `http://127.0.0.1:8000/admin/` after creating a superuser.

You can inspect:

- All users and their roles
- Uploaded documents
- Who has access to which document (DocumentAccess)
- Access requests and their status
- Full activity audit log
