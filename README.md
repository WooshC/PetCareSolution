# PetCare - Plataforma de Cuidado de Mascotas 🐾

Sistema de microservicios para conectar clientes con cuidadores de mascotas.

## 🏗️ Arquitectura de Microservicios

### 📦 Microservicios

| Servicio | Función | Base de Datos | Estado |
|----------|---------|---------------|--------|
| **auth-service** | Registro, login, JWT, asignación de roles | `db-auth` | ✅ Implementado |
| **cliente-service** | Perfil del cliente, historial de solicitudes | `db-cliente` | 🔄 Pendiente |
| **cuidador-service** | Perfil del cuidador, validaciones, historial de servicios | `db-cuidador` | 🔄 Pendiente |
| **request-service** | Crear solicitudes, asignar cuidadores, seguimiento | `db-request` | 🔄 Pendiente |
| **chat-service** | Chat en tiempo real (SignalR o WebSocket) | `db-chat` | 🔄 Pendiente |
| **rating-service** | Calificaciones y comentarios de clientes a cuidadores | `db-rating` | 🔄 Pendiente |
| **frontend** | React App para UI | - | 🔄 Pendiente |

### 🗃️ Bases de Datos

Cada servicio tiene su propia BD independiente:

- **db-auth** - Usuarios, roles y autenticación
- **db-cliente** - Perfiles de clientes
- **db-cuidador** - Perfiles de cuidadores
- **db-request** - Solicitudes de servicio
- **db-chat** - Mensajes y conversaciones
- **db-rating** - Calificaciones y comentarios

### 🧩 Diagrama de Interacción

```
Cliente (React) → auth-service ←→ JWT → [cliente-service | request-service | chat-service | rating-service]
                                 ↑
                                 |
                       cuidador-service

                        (todo conectado vía Docker y REST)
```

## 📚 Documentación por Servicio

### ✅ Servicios Implementados

- **[Auth Service](auth-service/README-Auth.md)** - Microservicio de autenticación con JWT e Identity

### 🔄 Servicios Pendientes

- **Cliente Service** - Gestión de perfiles de clientes
- **Cuidador Service** - Gestión de perfiles de cuidadores
- **Request Service** - Gestión de solicitudes de servicio
- **Chat Service** - Comunicación en tiempo real
- **Rating Service** - Sistema de calificaciones
- **Frontend** - Aplicación React

## 🚀 Inicio Rápido

### Opción 1: Inicio Automático (Recomendado)
```bash
# Clonar el repositorio
git clone <repository-url>
cd PetCareSolution

# Inicio rápido en modo desarrollo
.\scripts\quick-start.ps1 dev

# O en modo Docker
.\scripts\quick-start.ps1 docker
```

### Opción 2: Configuración Manual

#### Para Desarrollo Local:
```bash
# Configurar entorno de desarrollo
.\scripts\manage-environments.ps1 dev

# Ejecutar auth service
cd auth-service/PetCare.Auth
dotnet run
```

#### Para Docker:
```bash
# Configurar entorno de Docker
.\scripts\manage-environments.ps1 docker

# Ejecutar con Docker Compose
docker-compose up -d
```

### 3. Acceder a Swagger
📍 http://localhost:5001/swagger

## 🧭 Plan de Desarrollo

1. ✅ **auth-service** - Completado
2. 🔄 **cliente-service** - Próximo
3. 🔄 **cuidador-service** - Próximo
4. 🔄 **request-service** - Próximo
5. 🔄 **chat-service** - Próximo
6. 🔄 **rating-service** - Próximo
7. 🔄 **frontend** - Final

## 🐳 Docker

### Puertos Configurados
- **Auth Service**: http://localhost:5001
- **SQL Server**: localhost:14400
- **Swagger**: http://localhost:5001/swagger

### Comandos Docker
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs del auth service
docker-compose logs -f petcare-auth

# Detener servicios
docker-compose down

# Reconstruir y reiniciar
docker-compose up -d --build
```

## 🔧 Gestión de Entornos

### Configuraciones Disponibles
- **Desarrollo Local**: Usa LocalDB para desarrollo rápido
- **Docker**: Usa SQL Server en contenedor
- **Producción**: Configuración para servidor de producción

### Comandos de Gestión
```bash
# Ver configuración actual
.\scripts\manage-environments.ps1 show

# Configurar para desarrollo local
.\scripts\manage-environments.ps1 dev

# Configurar para Docker
.\scripts\manage-environments.ps1 docker

# Configurar para producción
.\scripts\manage-environments.ps1 prod
```

### Entornos por Defecto
- **LocalDB**: `Server=(localdb)\mssqllocaldb;Database=PetCareAuth;Trusted_Connection=true`
- **Docker**: `Server=db;Database=PetCareAuth;User=sa;Password=YourStrong@Passw0rd`
- **Producción**: `Server=prod-server;Database=PetCareAuth;User=petcare_user;Password=SecurePassword123`

## 📋 Endpoints Principales

### Auth Service
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios

Ver [documentación completa del Auth Service](auth-service/README-Auth.md) para más detalles.

---

**Estado del Proyecto**: En desarrollo activo 🚀