# PetCare - Plataforma de Cuidado de Mascotas 🐾

Sistema de microservicios para conectar clientes con cuidadores de mascotas.

## 🏗️ Arquitectura

### 📦 Microservicios

| Servicio | Función | Estado |
|----------|---------|--------|
| **auth-service** | Registro, login, JWT, roles | ✅ Implementado |
| **cliente-service** | Perfil del cliente | 🔄 Pendiente |
| **cuidador-service** | Perfil del cuidador | 🔄 Pendiente |
| **request-service** | Solicitudes de servicio | 🔄 Pendiente |
| **chat-service** | Chat en tiempo real | 🔄 Pendiente |
| **rating-service** | Calificaciones | 🔄 Pendiente |

## 🚀 Inicio Rápido

### Desarrollo Local
```bash
# 1. Configurar SQL Server local
# - Instalar SQL Server en localhost:1433
# - Usuario: sa, Contraseña: admin1234

# 2. Ejecutar auth service
cd auth-service/PetCare.Auth
dotnet run

# 3. Acceder a Swagger
# http://localhost:5001/swagger
```

### Docker
```bash
# 1. Ejecutar con Docker Compose
docker-compose up -d

# 2. Acceder a Swagger
# http://localhost:5001/swagger
```

## 📋 Configuración

### Desarrollo Local
- **Archivo**: `auth-service/PetCare.Auth/appsettings.json`
- **Conexión**: `Server=localhost,1433;Database=PetCareAuth;User Id=sa;Password=admin1234;TrustServerCertificate=true;`

### Docker
- **Archivo**: `auth-service/PetCare.Auth/appsettings.Docker.json`
- **Conexión**: `Server=db;Database=PetCareAuth;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;`

## 🐳 Docker

### Puertos
- **Auth Service**: http://localhost:5001
- **SQL Server**: localhost:14400
- **Swagger**: http://localhost:5001/swagger

### Comandos
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f petcare-auth

# Detener servicios
docker-compose down
```

## 📋 Endpoints

### Auth Service
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios
- `GET /api/auth/users` - Listar usuarios (desarrollo)
- `GET /api/auth/me` - Usuario actual

Ver [documentación completa del Auth Service](auth-service/README-Auth.md) para más detalles.

---

**Estado del Proyecto**: En desarrollo activo 🚀