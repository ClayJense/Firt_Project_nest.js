# API Documentation - Overview

## Project Architecture

This NestJS application provides a complete user authentication and management system with the following features:

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 10 salt rounds for password security
- **Route Guards**: JWTAuthGuard for protected routes
- **Email Validation**: Unique email constraint with pre-registration validation
- **Data Sanitization**: Sensitive data (passwords) excluded from API responses

### 📊 Database Integration
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Robust relational database
- **Migrations**: Schema versioning and updates
- **Connection Pooling**: Efficient database connection management

### 🚀 API Features
- **User Registration**: Email validation with conflict detection
- **User Authentication**: Secure login with JWT token generation
- **Profile Management**: Protected user profile access
- **User Listing**: Public user information retrieval
- **Error Handling**: Comprehensive error responses with proper HTTP status codes

## Quick Start

### Base URL
```
http://localhost:3000
```

### Authentication Flow
1. **Register**: `POST /users/register` - Create account and receive token
2. **Login**: `POST /auth/login` - Authenticate and receive token
3. **Access**: Include `Authorization: Bearer <token>` header for protected routes

### Key Endpoints
- **User Management**: `/users/*` - Registration, user listing, user details
- **Authentication**: `/auth/*` - Login, profile access

## Documentation Structure

### 📋 [User API Documentation](./user-api.md)
Complete guide for user management endpoints including:
- User registration with automatic token generation
- User listing and individual user retrieval
- Email validation and conflict handling
- Frontend integration examples

### 🔑 [Authentication API Documentation](./auth-api.md)
Comprehensive authentication documentation covering:
- Login flow and JWT token management
- Protected route access with guards
- Token structure and validation
- Security best practices and frontend integration

## Security Implementation

### JWT Token Structure
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Password Security
- bcrypt hashing with 10 salt rounds
- Secure password comparison
- No plain text password storage
- Password exclusion from API responses

### Route Protection
- JwtAuthGuard implementation
- Automatic token validation
- User payload extraction
- Graceful authentication failure handling

## Frontend Integration

### Required Headers
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt-token>' // For protected routes
}
```

### Common Response Format
```javascript
// Success Response
{
  "data": { ... },
  "statusCode": 200
}

// Error Response
{
  "message": "Error description",
  "error": "ErrorType",
  "statusCode": 400
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication failures)
- `404` - Not Found (user not found)
- `409` - Conflict (email already exists)
- `500` - Internal Server Error

## Development Notes

### Environment Setup
- Node.js with TypeScript support
- PostgreSQL database connection
- Prisma client configuration
- JWT secret key configuration

### Key Dependencies
- `@nestjs/core` - NestJS framework
- `@nestjs/jwt` - JWT authentication
- `@nestjs/passport` - Authentication strategies
- `@prisma/client` - Database ORM
- `bcrypt` - Password hashing

### Database Schema
```sql
model User {
  id       String   @id @default(cuid())
  name     String
  email    String   @unique
  password String
  age      Int
}
```

## Best Practices

### For Frontend Developers
- Store JWT tokens securely
- Implement proper error handling
- Validate user input before API calls
- Handle loading states appropriately
- Implement proper logout functionality

### For Backend Developers
- Keep JWT secrets secure
- Implement rate limiting
- Use environment variables for sensitive data
- Regular security updates
- Comprehensive error logging

### Security Considerations
- Always use HTTPS in production
- Implement token expiration
- Consider refresh tokens for better UX
- Monitor for suspicious activities
- Regular security audits

## Getting Help

### Common Issues
1. **Token Not Working**: Check token format and expiration
2. **Email Already Exists**: Use proper error handling for 409 responses
3. **Authentication Failures**: Verify credentials and token format
4. **Database Connection**: Check DATABASE_URL configuration

### Debugging Tips
- Check browser network tab for API responses
- Verify JWT token content using jwt.io
- Check server logs for detailed error information
- Ensure proper CORS configuration for frontend

## Next Steps

### Recommended Improvements
1. **Token Refresh**: Implement refresh token mechanism
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Email Verification**: Add email verification for registration
4. **Password Reset**: Implement forgot password functionality
5. **2FA**: Add two-factor authentication for enhanced security
6. **API Versioning**: Implement versioning for future updates

### Monitoring & Analytics
- Request/response logging
- Authentication event tracking
- Performance monitoring
- Error rate monitoring
- User activity analytics

---

**Last Updated**: 2025-02-09  
**Version**: 1.0.0  
**Framework**: NestJS with Prisma ORM
