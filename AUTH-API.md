# 🔐 BrickReel Authentication API

Documentación completa de los endpoints de autenticación implementados con Supabase y JWT.

## Base URL
```
http://localhost:3000/auth
```

---

## 📝 Endpoints

### 1. **Login**
Inicia sesión con email y contraseña.

**Endpoint:** `POST /auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "de64dec4-aad3-43b3-ad3a-d22a3e48337a",
      "email": "user@example.com",
      "user_metadata": {
        "full_name": "John Doe"
      }
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Email o contraseña faltantes
- `401 Unauthorized` - Email o contraseña inválida
- `500 Internal Server Error` - Error del servidor

---

### 2. **Sign Up**
Registra un nuevo usuario.

**Endpoint:** `POST /auth/signup`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "fullName": "John Doe"  // Opcional
}
```

**Response (201 Created):**
```json
{
  "message": "Signup successful. Please check your email to verify your account.",
  "data": {
    "id": "de64dec4-aad3-43b3-ad3a-d22a3e48337a",
    "email": "newuser@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "email_verified": false
    }
  }
}
```

**Validaciones:**
- Email debe ser válido
- Contraseña mínimo 6 caracteres
- Las contraseñas deben coincidir
- Email no debe estar registrado

**Error Responses:**
- `400 Bad Request` - Validación fallida
- `409 Conflict` - Email ya registrado
- `500 Internal Server Error` - Error del servidor

---

### 3. **Refresh Token**
Obtén un nuevo token de acceso usando el refresh token.

**Endpoint:** `POST /auth/refresh`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "de64dec4-aad3-43b3-ad3a-d22a3e48337a",
      "email": "user@example.com"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Refresh token no proporcionado
- `401 Unauthorized` - Refresh token inválido o expirado
- `500 Internal Server Error` - Error del servidor

---

### 4. **Logout**
Cierra la sesión del usuario. *(Requiere autenticación)*

**Endpoint:** `POST /auth/logout`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful",
  "data": {
    "success": true
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Token no proporcionado o inválido
- `500 Internal Server Error` - Error del servidor

---

### 5. **Get Current User**
Obtén la información del usuario autenticado. *(Requiere autenticación)*

**Endpoint:** `GET /auth/me`

**Headers:**
```json
{
  "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

**Response (200 OK):**
```json
{
  "message": "User retrieved",
  "data": {
    "id": "de64dec4-aad3-43b3-ad3a-d22a3e48337a",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "email_verified": true
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Token no proporcionado o inválido
- `500 Internal Server Error` - Error del servidor

---

## 🔑 Authentication

### Authorization Header
Para acceder a endpoints protegidos, incluye el token de acceso en el header:

```
Authorization: Bearer <ACCESS_TOKEN>
```

### Token Format
Los tokens son JWT que contienen:
- `userId`: ID del usuario
- `email`: Email del usuario
- `type`: Tipo de token (access o refresh)
- `iat`: Timestamp de creación
- `exp`: Timestamp de expiración

### Token Expiration
- **Access Token**: Expira en 1 hora
- **Refresh Token**: Expira en 7 días

---

## 📱 Uso desde el Frontend (Next.js)

### Importar funciones de autenticación:
```typescript
import { login, signup, logout, getToken, getUser } from '@/lib/auth';
```

### Login:
```typescript
try {
  const response = await login(email, password);
  console.log('Usuario:', response.data.user);
  // Token se guarda automáticamente en localStorage
} catch (error) {
  console.error('Error:', error.message);
}
```

### Signup:
```typescript
try {
  const response = await signup(email, password, confirmPassword, fullName);
  console.log('Usuario registrado:', response.data);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Logout:
```typescript
logout();
// Tokens se limpian automáticamente
```

### Hacer llamadas autenticadas:
```typescript
import { authenticatedFetch } from '@/lib/auth';

try {
  const response = await authenticatedFetch('/analysis', {
    method: 'POST',
    body: JSON.stringify({ /* data */ })
  });
  const data = await response.json();
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## 🔒 Seguridad

### Mejores Prácticas Implementadas:
✅ Validación de input en el backend  
✅ Contraseñas hasheadas por Supabase  
✅ JWT con expiración  
✅ Refresh token flow  
✅ CORS configurado  
✅ Manejo robusto de errores  

### Consideraciones para Producción:
⚠️ Cambiar `JWT_SECRET` a un valor seguro  
⚠️ Usar HTTPS en producción  
⚠️ Considerar usar httpOnly cookies para tokens  
⚠️ Implementar rate limiting en endpoints públicos  
⚠️ Agregar email verification flow  
⚠️ Implementar password reset  

---

## 🧪 Ejemplos con cURL

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Signup:
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "fullName": "John Doe"
  }'
```

### Get Current User (con token):
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 📚 Archivos Relevantes

### Backend:
- `src/services/auth.service.js` - Lógica de autenticación
- `src/controllers/auth.controller.js` - Controladores de endpoints
- `src/routes/auth.routes.js` - Definición de rutas
- `src/middleware/auth.middleware.js` - Validación de tokens

### Frontend:
- `lib/auth.ts` - Cliente de autenticación
- `components/LoginForm.tsx` - Componente de login
- `app/(auth)/login/page.tsx` - Página de login
- `app/(auth)/signup/page.tsx` - Página de signup

---

## 📞 Contacto y Soporte

Para reportar problemas o sugerencias, abre un issue en el repositorio.
