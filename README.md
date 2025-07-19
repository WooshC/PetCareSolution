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

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd PetCareSolution
```

### 2. Configurar Auth Service
```bash
cd auth-service/PetCare.Auth
.\scripts\init-project.ps1
dotnet run
```

### 3. Acceder a Swagger
📍 http://localhost:5042/swagger

## 🧭 Plan de Desarrollo

1. ✅ **auth-service** - Completado
2. 🔄 **cliente-service** - Próximo
3. 🔄 **cuidador-service** - Próximo
4. 🔄 **request-service** - Próximo
5. 🔄 **chat-service** - Próximo
6. 🔄 **rating-service** - Próximo
7. 🔄 **frontend** - Final

## 🐳 Docker

Para ejecutar todos los servicios con Docker:

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

## 📋 Endpoints Principales

### Auth Service
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios

Ver [documentación completa del Auth Service](auth-service/README-Auth.md) para más detalles.

---

**Estado del Proyecto**: En desarrollo activo 🚀