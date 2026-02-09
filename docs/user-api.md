# API Documentation - User Management

## Overview
This document describes the User Management API endpoints for user registration, retrieval, and profile management.

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Register New User
Create a new user account with automatic JWT token generation.

**Endpoint:** `POST /users/register`

**Authentication:** None required

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "age": "number"
}
```

**Request Body Example:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "age": 25
}
```

**Success Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- **409 Conflict** - Email already exists
```json
{
  "message": "Cet email est déjà utilisé",
  "error": "Conflict",
  "statusCode": 409
}
```

- **400 Bad Request** - Invalid input data
```json
{
  "message": ["name must be a string", "email must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Get All Users
Retrieve a list of all users (public information only).

**Endpoint:** `GET /users`

**Authentication:** None required

**Success Response (200):**
```json
[
  {
    "id": "clx1234567890abc",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 25
  },
  {
    "id": "clx1234567891def",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "age": 30
  }
]
```

**Error Response (500):**
```json
{
  "message": "Internal server error",
  "error": "Internal Server Error",
  "statusCode": 500
}
```

### Get User by ID
Retrieve specific user information by ID.

**Endpoint:** `GET /users/:id`

**Authentication:** None required

**Path Parameters:**
- `id` (string): The unique user ID

**Success Response (200):**
```json
{
  "id": "clx1234567890abc",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 25
}
```

**Error Responses:**

- **404 Not Found** - User doesn't exist
```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

- **400 Bad Request** - Invalid ID format
```json
{
  "message": "Validation failed (uuid is expected)",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Security Features

### Password Hashing
- Passwords are hashed using bcrypt with 10 salt rounds
- Plain passwords are never stored in the database
- Automatic password hashing during registration

### Email Uniqueness
- Email addresses must be unique across all users
- Pre-registration validation prevents duplicate emails
- Clear error message when email already exists

### Data Sanitization
- User passwords are excluded from all API responses
- Only public user information (id, name, email, age) is returned
- Secure data selection in database queries

## Frontend Integration Examples

### JavaScript/TypeScript Example
```typescript
// Register new user
const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  age: number;
}) => {
  try {
    const response = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      // Store token securely
      localStorage.setItem('token', data.access_token);
      return data;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/users');
    
    if (response.ok) {
      const users = await response.json();
      return users;
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    console.error('Fetch users error:', error);
    throw error;
  }
};

// Get user by ID
const getUserById = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    
    if (response.ok) {
      const user = await response.json();
      return user;
    } else if (response.status === 404) {
      throw new Error('User not found');
    } else {
      throw new Error('Failed to fetch user');
    }
  } catch (error) {
    console.error('Fetch user error:', error);
    throw error;
  }
};
```

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};
```

## Rate Limiting & Best Practices

### Frontend Considerations
- Store JWT tokens securely (httpOnly cookies recommended)
- Implement proper error handling for network requests
- Validate user input before sending API requests
- Handle loading states and user feedback appropriately
- Implement proper logout functionality to clear stored tokens

### Error Handling
- Always check response status before processing data
- Implement user-friendly error messages
- Log errors for debugging purposes
- Handle network timeouts and connection issues

### Security Best Practices
- Never expose sensitive information in frontend logs
- Implement proper input validation on both frontend and backend
- Use HTTPS in production environments
- Consider implementing refresh tokens for better security
- Regular token validation and rotation
