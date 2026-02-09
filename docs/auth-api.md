# API Documentation - Authentication

## Overview
This document describes the Authentication API endpoints for user login, JWT token management, and protected route access.

## Base URL
```
http://localhost:3000
```

## Authentication Flow
The API uses JWT (JSON Web Tokens) for authentication:
1. User logs in with email/password
2. Server validates credentials and returns JWT token
3. Client includes token in Authorization header for protected routes
4. Token contains user ID and email for identification

## Endpoints

### User Login
Authenticate user and receive JWT token for subsequent requests.

**Endpoint:** `POST /auth/login`

**Authentication:** None required

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Request Body Example:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHgxMjM0NTY3ODkwYWJjIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTY5NjU0MzIwMCwiZXhwIjoxNjk2NTQ2ODAwfQ.signature"
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid credentials
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

- **400 Bad Request** - Missing or invalid input
```json
{
  "message": ["email must be an email", "password must be a string"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Get User Profile
Retrieve the authenticated user's profile information.

**Endpoint:** `GET /auth/profile`

**Authentication:** Required (JWT Bearer Token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

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

- **401 Unauthorized** - Invalid or missing token
```json
{
  "message": "Unauthorized",
  "error": "Unauthorized",
  "statusCode": 401
}
```

- **401 Unauthorized** - User not found
```json
{
  "message": "User not found",
  "error": "Unauthorized",
  "statusCode": 401
}
```

## JWT Token Structure

### Token Payload
```json
{
  "sub": "clx1234567890abc",  // User ID
  "email": "john.doe@example.com",  // User email
  "iat": 1696543200,  // Issued at (timestamp)
  "exp": 1696546800   // Expires at (timestamp)
}
```

### Token Validation
- Tokens are automatically validated by JWT guards
- Expired tokens are rejected with 401 status
- Invalid tokens are rejected with 401 status
- Token extraction from Authorization header is automatic

## Security Features

### Password Security
- Passwords are compared using bcrypt comparison
- Plain passwords are never stored or transmitted in responses
- Secure password validation during login
- Protection against timing attacks

### JWT Security
- Tokens are signed with a secret key
- Token expiration prevents indefinite access
- Automatic token validation on protected routes
- Secure token extraction from headers

### Route Protection
- Protected routes use JwtAuthGuard
- Automatic token verification
- User payload extraction from token
- Graceful handling of authentication failures

## Frontend Integration Examples

### JavaScript/TypeScript Authentication Service
```typescript
class AuthService {
  private baseUrl = 'http://localhost:3000';
  private token: string | null = null;

  // Login method
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.access_token;
        localStorage.setItem('token', this.token);
        return data;
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get user profile
  async getProfile() {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        return user;
      } else if (response.status === 401) {
        this.logout();
        throw new Error('Session expired. Please login again.');
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  // Logout method
  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get stored token
  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  // Initialize from storage
  initializeAuth() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
```

### React Hook for Authentication
```typescript
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from './authService';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService.initializeAuth();
    if (authService.isAuthenticated()) {
      fetchUserProfile();
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      await fetchUserProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Axios Interceptor for Automatic Token Handling
```typescript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Login Form Component (React)
```typescript
import React, { useState } from 'react';
import { useAuth } from './useAuth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      // Redirect or show success message
    } catch (err) {
      // Error is already handled by useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

## Best Practices

### Token Management
- Store tokens securely (httpOnly cookies recommended for production)
- Implement token refresh mechanism for long-lived sessions
- Clear tokens on logout and token expiration
- Consider implementing token blacklisting for logout

### Error Handling
- Handle 401 responses gracefully (redirect to login)
- Show user-friendly error messages
- Implement retry logic for network failures
- Log authentication events for security monitoring

### Security Considerations
- Always use HTTPS in production
- Implement rate limiting on login endpoints
- Consider implementing 2FA for enhanced security
- Monitor for suspicious login patterns
- Implement proper session management

### Frontend Security
- Never store sensitive data in localStorage for production
- Implement proper input validation
- Use secure cookie flags if using cookies
- Consider implementing CSRF protection
- Regular security audits and updates
