# PetCare - Auth Service 🔐

Microservicio de autenticación para PetCare con JWT e Identity

## Estructura del Proyecto 🏗️
PetCare.Auth/
├── Controllers/
│ └── AuthController.cs # Endpoints de autenticación ✅
├── Data/
│ └── AuthDbContext.cs # Contexto de BD con Identity ✅
├── Migrations/
│ ├── README.md # Documentación de migraciones ✅
│ └── *.cs # Archivos de migración ✅
├── Models/
│ ├── Auth/
│ │ ├── AuthResponse.cs # Respuesta de autenticación ✅
│ │ ├── LoginRequest.cs # DTO para login ✅
│ │ ├── RegisterRequest.cs # DTO para registro ✅
│ │ ├── PasswordReset*.cs # DTOs para reset de contraseña ✅
│ │ ├── User.cs # Entidad Usuario extendida ✅
│ │ ├── UserInfo.cs # DTO para información de usuario ✅
│ │ └── UserRole.cs # Roles personalizados ✅
├── Services/
│ └── AuthService.cs # Lógica de autenticación ✅
├── Program.cs # Configuración principal ✅
├── appsettings.json # Configuración local ✅
└── appsettings.Docker.json # Configuración Docker ✅

## Endpoints principales 🌐

| Método | Endpoint           | Descripción                           | Status |
|--------|--------------------|---------------------------------------|--------|
| POST   | /api/auth/register | Registro de nuevos usuarios (Cliente/Cuidador) | ✅ |
| POST   | /api/auth/login    | Inicio de sesión (obtener JWT)        | ✅ |
| POST   | /api/auth/reset-password | Solicitar reset de contraseña    | ✅ |
| POST   | /api/auth/confirm-reset | Confirmar reset de contraseña    | ✅ |
| POST   | /api/auth/change-password | Cambio directo de contraseña     | ✅ |
| GET    | /api/auth/users    | Lista de usuarios (desarrollo)       | ✅ |
| GET    | /api/auth/users/{id} | Usuario específico (desarrollo)    | ✅ |
| GET    | /api/auth/me       | Usuario actual (requiere JWT)        | ✅ |
| GET    | /api/auth/test     | Endpoint de prueba                    | ✅ |

## Configuración ⚙️

### Desarrollo Local (`appsettings.json`):
```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost,1433;Database=PetCareAuth;User Id=sa;Password=admin1234;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "TuClaveSecretaDe64CaracteresParaJWTTokenSeguro2024",
    "Issuer": "PetCare.Auth",
    "Audience": "PetCare.Client",
    "ExpireDays": 7
  }
}
```

### Docker (`appsettings.Docker.json`):
```json
{
  "ConnectionStrings": {
    "Default": "Server=db;Database=PetCareAuth;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "TuClaveSecretaDe64CaracteresParaJWTTokenSeguro2024",
    "Issuer": "PetCare.Auth",
    "Audience": "PetCare.Client",
    "ExpireDays": 7
  }
}
```

## Características Implementadas ✨

- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Registro de usuarios** con validación
- ✅ **Login con credenciales** 
- ✅ **Reset de contraseña** por email (simulado)
- ✅ **Roles de usuario** (Admin, Cliente, Cuidador)
- ✅ **Validación de datos** con Data Annotations
- ✅ **Swagger/OpenAPI** para documentación
- ✅ **Base de datos automática** en desarrollo
- ✅ **Migraciones automáticas** con EF Core
- ✅ **Carpeta de migraciones** con documentación
- ✅ **Configuración simple** en appsettings.json
- ✅ **Docker ready** con appsettings.Docker.json
- ✅ **CORS configurado** para desarrollo
- ✅ **Logging detallado** para debugging
- ✅ **Endpoints de prueba** para verificación

## Uso 🚀

### 🖥️ Desarrollo Local

#### Prerrequisitos:
1. **SQL Server local** corriendo en puerto 1433
2. **Usuario SA** con contraseña `admin1234`
3. **.NET 8.0 SDK** instalado

#### Pasos:
```bash
# 1. Verificar que SQL Server esté corriendo
netstat -an | findstr 1433

# 2. Ir al directorio del proyecto
cd auth-service/PetCare.Auth

# 3. Establecer entorno de desarrollo
set ASPNETCORE_ENVIRONMENT=Development

# 4. Ejecutar aplicación
dotnet run

# 5. Acceder a Swagger
# http://localhost:5042/swagger
```

#### Verificación:
- Los logs mostrarán: `🔧 Entorno detectado: Development`
- Connection string: `Server: localhost,1433`
- Migraciones se aplicarán automáticamente

### 🐳 Docker

#### Prerrequisitos:
1. **Docker Desktop** instalado y corriendo
2. **Docker Compose** disponible

#### Pasos:
```bash
# 1. Ir al directorio raíz del proyecto
cd PetCareSolution

# 2. Ejecutar con Docker Compose
docker-compose up -d

# 3. Verificar que los contenedores estén corriendo
docker-compose ps

# 4. Ver logs en tiempo real
docker-compose logs -f petcare-auth

# 5. Acceder a Swagger
# http://localhost:5001/swagger
```

#### Verificación:
- Los logs mostrarán: `🔧 Entorno detectado: Docker`
- Connection string: `Server: db`
- Migraciones se aplicarán automáticamente

### 🔧 Comandos Útiles

#### Desarrollo Local:
```bash
# Aplicar migraciones manualmente
dotnet ef database update

# Crear nueva migración
dotnet ef migrations add NombreMigracion

# Ver migraciones aplicadas
dotnet ef migrations list
```

#### Docker:
```bash
# Reconstruir imagen
docker-compose build --no-cache

# Ver logs específicos
docker-compose logs petcare-auth

# Entrar al contenedor
docker-compose exec petcare-auth bash

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## Ejemplos de Uso 📝

### Registro de Cliente
```json
POST /api/auth/register
{
  "email": "cliente@ejemplo.com",
  "password": "Password123!",
  "name": "Cliente Ejemplo",
  "role": "Cliente"
}
```

### Registro de Cuidador
```json
POST /api/auth/register
{
  "email": "cuidador@ejemplo.com",
  "password": "Password123!",
  "name": "Cuidador Ejemplo",
  "role": "Cuidador"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "cliente@ejemplo.com",
  "password": "Password123!"
}
```

### Obtener Usuarios (Desarrollo)
```bash
GET /api/auth/users
```

### Endpoint de Prueba
```bash
GET /api/auth/test
```

## Roles de Usuario 👥

### Roles Disponibles
- **Cliente** - Usuarios que solicitan servicios de cuidado de mascotas
- **Cuidador** - Usuarios que ofrecen servicios de cuidado de mascotas
- **Admin** - Administradores del sistema (creado automáticamente)

### Asignación de Roles
- Los roles se asignan durante el registro
- Solo se permiten roles "Cliente" o "Cuidador" en el registro
- El rol se incluye en el JWT token para autorización
- Los roles se crean automáticamente en la base de datos

## Seguridad 🔒

- Contraseñas hasheadas con Identity
- Tokens JWT con expiración configurable
- Validación de email único
- Requisitos de contraseña segura
- Tokens de reset con expiración
- Validación de roles en el registro
- CORS configurado para desarrollo

## Dependencias 📦

- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.AspNetCore.Identity.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer
- System.IdentityModel.Tokens.Jwt
- Swashbuckle.AspNetCore

## Troubleshooting 🔧

### Problemas Comunes:

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar SQL Server local
sqlcmd -S localhost,1433 -U sa -P admin1234 -Q "SELECT 1"

# Verificar puerto
netstat -an | findstr 1433
```

#### 2. Swagger No Funciona
```bash
# Verificar que la aplicación esté corriendo
curl http://localhost:5042/api/auth/test

# Verificar logs
docker-compose logs petcare-auth
```

#### 3. Migraciones No Se Aplican
```bash
# Aplicar manualmente
dotnet ef database update

# Verificar base de datos
sqlcmd -S localhost,1433 -U sa -P admin1234 -d PetCareAuth -Q "SELECT * FROM __EFMigrationsHistory"
```

#### 4. Contenedor Docker Se Cae
```bash
# Ver logs detallados
docker-compose logs -f petcare-auth

# Reconstruir sin cache
docker-compose build --no-cache petcare-auth
```

## Diagrama de Flujo 🔄

```mermaid
sequenceDiagram
    Cliente->>+AuthService: POST /register
    AuthService->>+DB: Crear usuario
    DB-->>-AuthService: Usuario creado
    AuthService-->>-Cliente: JWT
    
    Cliente->>+AuthService: POST /login
    AuthService->>+DB: Validar credenciales
    DB-->>-AuthService: Usuario válido
    AuthService-->>-Cliente: JWT
    
    Cliente->>+AuthService: GET /users
    AuthService->>+DB: Obtener usuarios
    DB-->>-AuthService: Lista de usuarios
    AuthService-->>-Cliente: JSON con usuarios
```