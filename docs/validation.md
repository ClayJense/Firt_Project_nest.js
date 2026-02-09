# API Validation Documentation

## Overview
This document describes the validation rules implemented for user registration and login endpoints using `class-validator` and `class-transformer`.

## Validation Configuration

### Global Validation Pipe
The application uses a global validation pipe with the following configuration:
- **whitelist**: true - Removes properties not defined in DTOs
- **forbidNonWhitelisted**: true - Returns error for undefined properties
- **transform**: true - Automatically transforms payloads to DTO objects
- **enableImplicitConversion**: true - Automatic type conversion

## User Registration Validation

### Endpoint: `POST /users/register`

#### Request Body Validation Rules

##### Name Field
```typescript
name: string
```

**Validation Rules:**
- **Required**: Yes
- **Type**: String
- **Minimum Length**: 2 characters
- **Maximum Length**: 50 characters
- **Pattern**: Letters, spaces, hyphens, and apostrophes only (including accented characters)
- **Auto-trim**: Whitespace automatically removed

**Validation Decorators:**
```typescript
@IsString()
@IsNotEmpty({ message: 'Le nom est obligatoire' })
@MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
@MaxLength(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
@Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
  message: 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes',
})
@Transform(({ value }) => value?.trim())
```

**Valid Examples:**
- `"John Doe"`
- `"Jean-Marc Dupont"`
- `"Marie O'Connor"`
- `"José García"`

**Invalid Examples:**
- `"J"` (too short)
- `"A".repeat(51)` (too long)
- `"John123"` (contains numbers)
- `"John@Doe"` (contains special characters)

---

##### Email Field
```typescript
email: string
```

**Validation Rules:**
- **Required**: Yes
- **Type**: Valid email format
- **Auto-lowercase**: Automatically converted to lowercase
- **Auto-trim**: Whitespace automatically removed

**Validation Decorators:**
```typescript
@IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
@IsNotEmpty({ message: 'L\'email est obligatoire' })
@Transform(({ value }) => value?.toLowerCase().trim())
```

**Valid Examples:**
- `"john.doe@example.com"`
- `"user.name+tag@domain.co.uk"`
- `"JEAN.DUPONT@EXAMPLE.COM"` (auto-converted to lowercase)

**Invalid Examples:**
- `"invalid-email"`
- `"@example.com"`
- `"user@"`
- `"user@domain"` (missing TLD)

---

##### Password Field
```typescript
password: string
```

**Validation Rules:**
- **Required**: Yes
- **Type**: String
- **Minimum Length**: 8 characters
- **Maximum Length**: 128 characters
- **Complex Requirements**: Must contain at least:
  - 1 lowercase letter
  - 1 uppercase letter
  - 1 number
  - 1 special character from `@$!%*?&`

**Validation Decorators:**
```typescript
@IsString()
@IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
@MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
@MaxLength(128, { message: 'Le mot de passe ne peut pas dépasser 128 caractères' })
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
  message: 'Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial (@$!%*?&)',
})
```

**Valid Examples:**
- `"SecurePass123!"`
- `"MyPassword@2024"`
- `"ComplexP@ssw0rd"`

**Invalid Examples:**
- `"password"` (no uppercase, number, or special character)
- `"PASSWORD"` (no lowercase, number, or special character)
- `"Password"` (no number or special character)
- `"Pass123"` (too short)
- `"SecurePassword123"` (no special character)

---

##### Age Field
```typescript
age: number
```

**Validation Rules:**
- **Required**: Yes
- **Type**: Integer
- **Minimum Value**: 13
- **Maximum Value**: 120

**Validation Decorators:**
```typescript
@IsInt({ message: "L'âge doit être un nombre entier" })
@Min(13, { message: "L'âge minimum est de 13 ans" })
@Max(120, { message: "L'âge maximum est de 120 ans" })
@IsNotEmpty({ message: "L'âge est obligatoire" })
```

**Valid Examples:**
- `25`
- `13`
- `120`

**Invalid Examples:**
- `12` (too young)
- `121` (too old)
- `25.5` (not integer)
- `"25"` (string, will be converted if possible)

---

## User Login Validation

### Endpoint: `POST /auth/login`

#### Request Body Validation Rules

##### Email Field
Same validation rules as registration email field.

##### Password Field
```typescript
password: string
```

**Validation Rules:**
- **Required**: Yes
- **Type**: String
- **No length restrictions** (allows any password for authentication)

**Validation Decorators:**
```typescript
@IsString()
@IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
```

## Error Response Format

### Validation Errors (400 Bad Request)
When validation fails, the API returns a structured error response:

```json
{
  "message": [
    "Le nom doit contenir au moins 2 caractères",
    "Veuillez fournir une adresse email valide",
    "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial (@$!%*?&)"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Property Not Allowed (400 Bad Request)
If additional properties are sent that aren't defined in the DTO:

```json
{
  "message": "property extraProperty should not exist",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Frontend Integration Examples

### JavaScript/TypeScript Validation

#### Registration Form Validation
```typescript
interface RegistrationData {
  name: string;
  email: string;
  password: string;
  age: number;
}

const validateRegistration = (data: RegistrationData): string[] => {
  const errors: string[] = [];

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }
  if (data.name.length > 50) {
    errors.push('Le nom ne peut pas dépasser 50 caractères');
  }
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(data.name)) {
    errors.push('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Veuillez fournir une adresse email valide');
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  if (!data.password || data.password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (data.password.length > 128) {
    errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
  }
  if (!passwordRegex.test(data.password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial (@$!%*?&)');
  }

  // Age validation
  const age = Number(data.age);
  if (!Number.isInteger(age) || age < 13 || age > 120) {
    errors.push('L\'âge doit être un nombre entier entre 13 et 120 ans');
  }

  return errors;
};
```

#### React Form Component
```typescript
import React, { useState } from 'react';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const validationErrors: string[] = [];

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      validationErrors.push('Le nom doit contenir au moins 2 caractères');
    }
    if (formData.name.length > 50) {
      validationErrors.push('Le nom ne peut pas dépasser 50 caractères');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      validationErrors.push('Veuillez fournir une adresse email valide');
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!formData.password || formData.password.length < 8) {
      validationErrors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (!passwordRegex.test(formData.password)) {
      validationErrors.push('Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial (@$!%*?&)');
    }

    // Age validation
    const age = Number(formData.age);
    if (!Number.isInteger(age) || age < 13 || age > 120) {
      validationErrors.push('L\'âge doit être un nombre entier entre 13 et 120 ans');
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(Array.isArray(errorData.message) ? errorData.message : [errorData.message]);
        return;
      }

      // Handle successful registration
      console.log('Registration successful');
    } catch (error) {
      setErrors(['Une erreur est survenue lors de l\'inscription']);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with error display */}
      {errors.length > 0 && (
        <div className="error-list">
          {errors.map((error, index) => (
            <div key={index} className="error">{error}</div>
          ))}
        </div>
      )}
      
      <input
        type="text"
        placeholder="Nom"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      
      <input
        type="password"
        placeholder="Mot de passe"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      
      <input
        type="number"
        placeholder="Âge"
        value={formData.age}
        onChange={(e) => setFormData({...formData, age: e.target.value})}
      />
      
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default RegistrationForm;
```

## Security Considerations

### Password Requirements
- **Minimum 8 characters** prevents brute force attacks
- **Complexity requirements** prevent dictionary attacks
- **Special characters** add entropy
- **Maximum 128 characters** prevents DoS attacks

### Input Sanitization
- **Auto-trimming** prevents whitespace-based attacks
- **Email normalization** prevents duplicate accounts with case variations
- **Pattern validation** prevents injection attacks
- **Type conversion** prevents type confusion attacks

### Error Handling
- **Generic error messages** prevent information disclosure
- **Structured validation** provides clear feedback to users
- **Property filtering** prevents mass assignment attacks

## Testing Validation

### Test Cases for Registration

#### Valid Registration Requests
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "age": 25
}
```

#### Invalid Registration Requests

**Invalid Name:**
```json
{
  "name": "J",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "age": 25
}
```

**Invalid Email:**
```json
{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "SecurePass123!",
  "age": 25
}
```

**Invalid Password:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password",
  "age": 25
}
```

**Invalid Age:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "age": 12
}
```

**Extra Property (Should be rejected):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "age": 25,
  "extraProperty": "should be rejected"
}
```

## Best Practices

### For Frontend Developers
1. **Implement client-side validation** for better UX
2. **Show validation errors immediately** as users type
3. **Use appropriate input types** (email, password, number)
4. **Provide clear error messages** in the user's language
5. **Handle server validation errors** gracefully

### For Backend Developers
1. **Never trust client input** - always validate on server
2. **Use consistent validation rules** across all endpoints
3. **Provide meaningful error messages** for debugging
4. **Log validation failures** for security monitoring
5. **Keep validation rules updated** based on security requirements

### Security Recommendations
1. **Rate limiting** on registration endpoints
2. **Account lockout** after failed login attempts
3. **Password strength indicators** for better UX
4. **Regular security audits** of validation rules
5. **Input sanitization** before database operations
