# Video Management System API Documentation

## Table of Contents

- [Authentication](#authentication)
- [Person Management](#person-management)
- [Video Management](#video-management)

## Base URL

```
http://localhost:3000/api
```

## Authentication

### Register New User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user" // "user" or "admin"
}
```

**Response:**

```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Get Current User Profile

```http
GET /auth/me
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

## Person Management

### Create Person Profile

```http
POST /persons
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "John Doe",
  "occupation": ["Software Developer", "Technical Writer"],
  "description": "Full stack developer with 5 years of experience",
  "aliases": ["JD", "Johnny"],
  "img": "profile-image-url"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "person_id",
    "name": "John Doe",
    "occupation": ["Software Developer", "Technical Writer"],
    "description": "Full stack developer with 5 years of experience",
    "aliases": ["JD", "Johnny"],
    "img": "profile-image-url",
    "createdAt": "2024-12-31T...",
    "updatedAt": "2024-12-31T..."
  }
}
```

### Get All Persons

```http
GET /persons?page=1&limit=10&sort=name,-createdAt
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sorting criteria (prefix with - for descending)

**Response:**

```json
{
  "status": "success",
  "results": 10,
  "total": 45,
  "totalPages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "person_id",
      "name": "John Doe",
      "occupation": ["Software Developer"],
      "description": "...",
      "aliases": ["JD"],
      "img": "profile-image-url",
      "createdAt": "2024-12-31T...",
      "updatedAt": "2024-12-31T..."
    }
  ]
}
```

### Update Person Profile

```http
PATCH /persons/:id
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "John Doe Updated",
  "occupation": ["Senior Developer"],
  "description": "Updated description"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "person_id",
    "name": "John Doe Updated",
    "occupation": ["Senior Developer"],
    "description": "Updated description",
    "aliases": ["JD"],
    "img": "profile-image-url",
    "updatedAt": "2024-12-31T..."
  }
}
```

### Delete Person Profile

```http
DELETE /persons/:id
```

**Headers:**

```
Authorization: Bearer jwt_token_here
Role: admin
```

**Response:**

```json
{
  "status": "success",
  "data": null
}
```

## Video Management

### Upload Video

```http
POST /videos
```

**Headers:**

```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Form Data:**

```
video: [video file]
description: "Video description"
keywords: ["keyword1", "keyword2"]
relatedPeople: [
    {
        "person": "person_id",
        "name": "John Doe"
    }
]
datetime: "2024-12-31T12:00:00Z"
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "video_id",
    "videoLink": "/uploads/unique-video-filename",
    "description": "Video description",
    "keywords": ["keyword1", "keyword2"],
    "relatedPeople": [
      {
        "person": "person_id",
        "name": "John Doe"
      }
    ],
    "datetime": "2024-12-31T12:00:00Z",
    "createdAt": "2024-12-31T...",
    "updatedAt": "2024-12-31T..."
  }
}
```

### Get All Videos

```http
GET /videos?page=1&limit=10&sort=datetime,-createdAt
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sorting criteria (prefix with - for descending)

**Response:**

```json
{
  "status": "success",
  "results": 10,
  "total": 100,
  "totalPages": 10,
  "currentPage": 1,
  "data": [
    {
      "_id": "video_id",
      "videoLink": "/uploads/filename",
      "description": "...",
      "keywords": ["keyword1", "keyword2"],
      "relatedPeople": [
        {
          "person": {
            "_id": "person_id",
            "name": "John Doe",
            "occupation": ["Developer"],
            "img": "..."
          },
          "name": "John Doe"
        }
      ],
      "datetime": "2024-12-31T...",
      "createdAt": "2024-12-31T...",
      "updatedAt": "2024-12-31T..."
    }
  ]
}
```

### Search Videos

```http
GET /videos/search?query=keyword&startDate=2024-01-01&endDate=2024-12-31&people=person_id1,person_id2&keywords=keyword1,keyword2
```

**Query Parameters:**

- `query`: Search text (searches in description, keywords, and people names)
- `startDate`: Filter videos from this date
- `endDate`: Filter videos until this date
- `people`: Comma-separated list of person IDs
- `keywords`: Comma-separated list of keywords

**Response:**

```json
{
  "status": "success",
  "results": 5,
  "data": [
    {
      "_id": "video_id",
      "videoLink": "/uploads/filename",
      "description": "...",
      "keywords": ["keyword1"],
      "relatedPeople": [
        {
          "person": {
            "_id": "person_id1",
            "name": "John Doe",
            "occupation": ["Developer"],
            "img": "..."
          },
          "name": "John Doe"
        }
      ],
      "datetime": "2024-12-31T..."
    }
  ]
}
```

### Update Video

```http
PATCH /videos/:id
```

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "description": "Updated description",
  "keywords": ["updated", "keywords"],
  "relatedPeople": [
    {
      "person": "person_id",
      "name": "John Doe"
    }
  ],
  "datetime": "2024-12-31T12:00:00Z"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "video_id",
    "videoLink": "/uploads/filename",
    "description": "Updated description",
    "keywords": ["updated", "keywords"],
    "relatedPeople": [
      {
        "person": "person_id",
        "name": "John Doe"
      }
    ],
    "datetime": "2024-12-31T12:00:00Z",
    "updatedAt": "2024-12-31T..."
  }
}
```

### Delete Video

```http
DELETE /videos/:id
```

**Headers:**

```
Authorization: Bearer jwt_token_here
Role: admin
```

**Response:**

```json
{
  "status": "success",
  "data": null
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "status": "error",
  "message": "Error message describing the issue"
}
```

### 401 Unauthorized

```json
{
  "status": "fail",
  "message": "You are not logged in"
}
```

### 403 Forbidden

```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/video-management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
PORT=3000
```

## File Upload Limits

- Video files: Maximum 100MB
- Supported video formats: MP4, WebM, OGG
