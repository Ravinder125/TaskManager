# Task Manager API Documentation

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGO_URI=your_mongodb_uri
PORT=4000
ADMIN_INVITE_TOKEN=your_admin_token
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication Routes

#### Register User
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
```json
{
    "email": "user@example.com",
    "password": "password123",
    "adminInviteToken": "optional_token",
    "profileImage": "image_file"
}
```
- **Response**:
```json
{
    "success": true,
    "status": 201,
    "message": "User successfully created",
    "data": {
        "email": "user@example.com",
        "profileImageUrl": "url",
        "role": "admin/employee"
    }
}
```

#### Login User
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Response**:
```json
{
    "success": true,
    "status": 200,
    "message": "User successfully logged in",
    "data": {
        "_id": "user_id",
        "email": "user@example.com",
        "profileImageUrl": "url",
        "role": "admin/employee"
    }
}
```

### Task Routes

#### Create Task (Admin only)
- **URL**: `/api/v1/tasks`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer token`
- **Body**:
```json
{
    "title": "Task Title",
    "description": "Task Description",
    "assignedTo": ["user_id1", "user_id2"],
    "priority": "high/medium/low",
    "date": "due_date",
    "todoList": [
        { "text": "Todo item 1" },
        { "text": "Todo item 2" }
    ]
}
```

#### Get All Tasks
- **URL**: `/api/v1/tasks`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer token`
- **Query Parameters**: 
  - `status`: pending/in-progress/completed
- **Response**:
```json
{
    "success": true,
    "status": 200,
    "data": {
        "tasks": [...],
        "statusSummary": {
            "all": 10,
            "pendingTasks": 4,
            "inProgress": 3,
            "completedTasks": 3
        }
    }
}
```

#### Update Task Status
- **URL**: `/api/v1/tasks/:taskId/status`
- **Method**: `PATCH`
- **Headers**: `Authorization: Bearer token`
- **Body**:
```json
{
    "status": "completed/pending/in-progress"
}
```

### User Routes

#### Get All Users (Admin only)
- **URL**: `/api/v1/users`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer token`
- **Response**:
```json
{
    "success": true,
    "status": 200,
    "data": [
        {
            "_id": "user_id",
            "email": "user@example.com",
            "pendingTasks": 5,
            "inProgressTasks": 3,
            "completedTasks": 2
        }
    ]
}
```

### Authentication Headers

For protected routes, include the access token in the Authorization header:
```
Authorization: Bearer your_access_token
```

### Error Responses

All endpoints return errors in this format:
```json
{
    "success": false,
    "status": error_code,
    "message": "Error message"
}
```

## Notes for Frontend Integration

1. Handle file uploads using FormData for profile images
2. Store the access token securely (HTTP-only cookies are recommended)
3. Implement token refresh mechanism
4. Handle role-based access control (admin vs employee)
5. Implement proper error handling for all API responses

## CORS Configuration

The API allows requests from the following origins:
- http://localhost:5173
- http://localhost:4000
- http://localhost:5000

If you need to add more origins, contact the backend team.
