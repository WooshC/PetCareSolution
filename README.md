# PetCare Solution 🐾

Solución completa de microservicios para el cuidado de mascotas

## 📋 Descripción

PetCare Solution es una plataforma de microservicios diseñada para conectar dueños de mascotas con cuidadores profesionales. La arquitectura está basada en microservicios con bases de datos separadas por servicio.

## 🏗️ Estructura del Proyecto

```
PetCareSolution/
├── auth-service/           # 🔐 Servicio de Autenticación
│   ├── PetCare.Auth/      # API de autenticación con JWT
│   └── README-Auth.md     # 📖 Documentación del Auth Service
├── cliente-service/        # 👤 Servicio de Clientes
├── cuidador-service/       # 🏥 Servicio de Cuidadores
├── request-service/        # 📋 Servicio de Solicitudes (Futuro)
├── chat-service/          # 💬 Servicio de Chat (Futuro)
├── rating-service/        # ⭐ Servicio de Calificaciones (Futuro)
├── docker-compose.yml     # 🐳 Configuración de Docker
└── PetCare.sln           # 🎯 Solución principal
```

## Ejemplo de estructura

```
cliente-service/
├── PetCare.Cliente/
│   ├── Controllers/
│   │   └── ClienteController.cs      # Controlador principal
│   ├── Data/
│   │   └── ClienteDbContext.cs       # Contexto de base de datos
│   ├── Models/
│   │   └── Clientes/
│   │       ├── Cliente.cs            # Entidad principal
│   │       └── ClienteRequest.cs     # DTOs de request/response
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   └── IClienteService.cs    # Interfaz del servicio
│   │   └── ClienteService.cs         # Implementación del servicio
│   ├── Config/
│   │   └── AutoMapperProfile.cs      # Configuración de mapeo
│   ├── appsettings.json              # Configuración principal
│   ├── appsettings.Development.json  # Configuración desarrollo
│   ├── appsettings.Docker.json       # Configuración Docker
│   ├── Program.cs                    # Punto de entrada
│   ├── Dockerfile                    # Configuración Docker
│   └── PetCare.Cliente.http          # Archivo de pruebas
└── README-Cliente.md                 # Esta documentación
```

## 🚀 Servicios Implementados

### ✅ Auth Service (Completado)
- **Ubicación:** `auth-service/PetCare.Auth/`
- **Documentación:** [README-Auth.md](auth-service/README-Auth.md)
- **Funcionalidades:**
  - Registro de usuarios (Cliente/Cuidador/Admin)
  - Autenticación JWT
  - Gestión de roles
  - Reset de contraseñas
  - Endpoints de desarrollo y testing
  - Puerto local: 5043

### ✅ Cliente Service (Completado)
- **Ubicación:** `cliente-service/PetCare.Cliente/`
- **Documentación:** [README-Cliente.md](cliente-service/README-Cliente.md)
- **Funcionalidades:**
  - CRUD completo de perfiles de clientes
  - Autenticación JWT integrada
  - Gestión de perfiles personales
  - Verificación de documentos (Admin)
  - Soft delete
  - Base de datos separada (PetCareCliente)
  - Migraciones automáticas
  - Swagger con autenticación Bearer

### ✅ Cuidador Service (Completado)
- **Ubicación:** `cuidador-service/PetCare.Cuidador/`
- **Documentación:** [README-Cuidador.md](cuidador-service/README-Cuidador.md)
- **Funcionalidades:**
  - CRUD completo de perfiles de cuidadores
  - Autenticación JWT integrada
  - Gestión de perfiles personales
  - Verificación de documentos (Admin)
  - Endpoints de desarrollo y testing
  - Base de datos separada (PetCareCuidador)
  - Migraciones automáticas
  - Swagger con autenticación Bearer

### ✅ Request Service (Completado)
- **Ubicación:** `request-service/PetCare.Request/`
- **Documentación:** [README-Request.md](request-service/README-Request.md)
- **Funcionalidades:**
  - Gestión completa de solicitudes de servicios
  - Controladores separados por rol (Cliente, Cuidador, Admin)
  - Flujo completo de solicitudes (Crear → Asignar → Aceptar → Ejecutar → Finalizar)
  - Autenticación JWT con autorización por roles
  - Base de datos separada (PetCareRequest)
  - Migraciones automáticas
  - Swagger organizado por controladores
  - Validaciones de estado y propiedad de recursos

### 🔄 Servicios Futuros
- **Chat Service** - Sistema de mensajería
- **Rating Service** - Sistema de calificaciones
- **Chat Service** - Comunicación entre usuarios
- **Rating Service** - Sistema de calificaciones

## 🛠️ Tecnologías Utilizadas

- **Backend:** ASP.NET Core 8.0
- **Base de Datos:** SQL Server
- **ORM:** Entity Framework Core
- **Autenticación:** JWT + Identity
- **Contenedores:** Docker & Docker Compose
- **Documentación:** Swagger/OpenAPI

## 🚀 Inicio Rápido

### 🐳 Con Docker (Recomendado)

#### Prerrequisitos:
- Docker Desktop instalado y corriendo
- Docker Compose disponible

#### Pasos:
```bash
# 1. Clonar el repositorio
git clone https://github.com/WooshC/PetCareSolution.git
cd PetCareSolution

# 2. Ejecutar con Docker Compose
docker-compose up -d

# 3. Verificar que los servicios estén corriendo
docker-compose ps

# 4. Acceder a los servicios
# Auth Service: http://localhost:5001/swagger
# Cuidador Service: http://localhost:5008/swagger
# Cliente Service: http://localhost:5009/swagger
# SQL Server: localhost:14400 (Auth) / localhost:14405 (Cuidador) / localhost:14410 (Cliente)

# 5. Verificar que funcionan
curl http://localhost:5001/api/auth/test
curl http://localhost:5008/api/cuidador/test
curl http://localhost:5009/api/cliente/test
curl http://localhost:5128/api/solicitud/test
```

#### Verificación:
```bash
# Ver logs en tiempo real
docker-compose logs -f petcare-auth

# Verificar estado de contenedores
docker-compose ps

# Probar endpoint de prueba
curl http://localhost:5043/api/auth/test
```

### 🖥️ Desarrollo Local

#### Prerrequisitos:
- .NET 8.0 SDK
- SQL Server local en puerto 1433
- Usuario SA con contraseña (pon la contraseña de tu SQL Server local aquí)

#### Pasos:
```bash
# 1. Configurar SQL Server local
# - Instalar SQL Server
# - Configurar usuario SA con la contraseña correspondiente

# 2. Ejecutar el servicio deseado
cd <carpeta-del-servicio>
dotnet run
```
> ℹ️ Al ejecutar `dotnet run` por primera vez, .NET restaurará automáticamente los paquetes NuGet necesarios para ese proyecto. Si prefieres, puedes ejecutar `dotnet restore` manualmente antes de `dotnet run`.

> ℹ️ **Revisa el respectivo README para instrucciones detalladas de desarrollo local, puertos y configuración avanzada:**
> - [README-Auth.md](auth-service/README-Auth.md)
> - [README-Cuidador.md](cuidador-service/README-Cuidador.md)
> - [README-Cliente.md](cliente-service/README-Cliente.md)

## 🌐 Resumen de Puertos

### 🖥️ Desarrollo Local
| Servicio | Puerto HTTP | Puerto HTTPS | Swagger |
|----------|-------------|--------------|---------|
| **Auth Service** | 5001 | 7001 | http://localhost:5001/swagger |
| **Cuidador Service** | **5044** | 7044 | http://localhost:5044/swagger |
| **Cliente Service** | 5009 | 7009 | http://localhost:5009/swagger |
| **Request Service** | 5128 | 7254 | http://localhost:5128/swagger |

### 🐳 Docker
| Servicio | Puerto | Swagger |
|----------|--------|---------|
| **Auth Service** | 5001 | http://localhost:5001/swagger |
| **Cuidador Service** | **5008** | http://localhost:5008/swagger |
| **Cliente Service** | 5009 | http://localhost:5009/swagger |
| **Request Service** | 5010 | http://localhost:5010/swagger |

### 🗄️ Bases de Datos
| Servicio | Puerto Docker | Puerto Local |
|----------|---------------|--------------|
| **Auth DB** | 14400 | 1433 |
| **Cuidador DB** | 14405 | 1433 |
| **Cliente DB** | 14410 | 1433 |
| **Request DB** | 14415 | 1433 |

## 📚 Documentación por Servicio

### 🔐 Auth Service
- **Documentación completa:** [README-Auth.md](auth-service/README-Auth.md)
- **Endpoints principales:**
  - `POST /api/auth/register` - Registro de usuarios
  - `POST /api/auth/login` - Inicio de sesión
  - `GET /api/auth/users` - Lista de usuarios (desarrollo)
  - `GET /api/auth/test` - Endpoint de prueba
- **Base de datos:** PetCareAuth (puerto 14400)

### 🏥 Cliente Service
- **Documentación completa:** [README-Cliente.md](cliente-service/README-Cliente.md)
- **Endpoints principales:**
  - `GET /api/cliente` - Lista de clientes (Admin)
  - `GET /api/cliente/mi-perfil` - Mi perfil de cliente
  - `POST /api/cliente` - Crear perfil de cliente
  - `PUT /api/cliente/mi-perfil` - Actualizar mi perfil
  - `DELETE /api/cliente/mi-perfil` - Eliminar mi perfil (soft delete)
  - `GET /api/cliente/{id}` - Obtener cliente por ID (Admin)
  - `POST /api/cliente/{id}/verificar` - Verificar documento (Admin)
- **Autenticación:** JWT Bearer Token requerido
- **Base de datos:** PetCareCliente (puerto 14410)

### 🏥 Cuidador Service
- **Documentación completa:** [README-Cuidador.md](cuidador-service/README-Cuidador.md)
- **Endpoints principales:**
  - `GET /api/cuidador` - Lista de cuidadores (Cliente, Cuidador, Admin) **[Requiere Auth]**
  - `GET /api/cuidador/{id}` - Ver cuidador específico (Cliente, Cuidador, Admin) **[Requiere Auth]**
  - `GET /api/cuidador/mi-perfil` - Mi perfil de cuidador (Cuidador)
  - `POST /api/cuidador` - Crear perfil de cuidador (Cuidador)
  - `PUT /api/cuidador/mi-perfil` - Actualizar mi perfil (Cuidador)
  - `GET /api/cuidador/test` - Endpoint de prueba
- **Autenticación:** JWT Bearer Token con autorización por roles
- **Seguridad:** Endpoints de gestión restringidos por rol (Cuidador/Admin)
- **Base de datos:** PetCareCuidador (puerto 14405)

### 📋 Request Service
- **Documentación completa:** [README-Request.md](request-service/README-Request.md)
- **Controladores organizados por rol:**
  - **Cliente** (`/api/solicitudcliente`): Crear, gestionar y cancelar solicitudes
  - **Cuidador** (`/api/solicitudcuidador`): Aceptar, rechazar y ejecutar servicios
  - **Admin** (`/api/solicitud`): Gestión administrativa y asignaciones
- **Endpoints principales:**
  - `POST /api/solicitudcliente` - Crear solicitud (Cliente)
  - `GET /api/solicitudcliente/mis-solicitudes` - Mis solicitudes (Cliente)
  - `PUT /api/solicitudcliente/{id}/asignar-cuidador` - Asignar cuidador (Cliente)
  - `POST /api/solicitudcuidador/{id}/aceptar` - Aceptar solicitud (Cuidador)
  - `GET /api/solicitud` - Todas las solicitudes (Admin)
  - `GET /api/solicitud/test` - Endpoint de prueba
  - `GET /api/solicitud/debug-cuidador/{id}` - Debug validación de cuidador
- **Autenticación:** JWT Bearer Token con autorización por roles
- **Validaciones:** Verificación completa de cuidadores (existencia, estado activo, documento verificado)
- **Comunicación inter-servicios:** Request Service ↔ Cuidador Service con autenticación JWT
- **Base de datos:** PetCareRequest (puerto 14415)

### 🔄 Servicios Futuros
- **Chat Service** - Sistema de mensajería
- **Rating Service** - Sistema de calificaciones
- **Chat Service** - Documentación pendiente
- **Rating Service** - Documentación pendiente

## 🔧 Comandos Útiles

### Docker
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs específicos
docker-compose logs -f petcare-auth
docker-compose logs -f petcare-cuidador
docker-compose logs -f db-auth
docker-compose logs -f db-cuidador

# Reconstruir un servicio
docker-compose build --no-cache petcare-auth
docker-compose build --no-cache petcare-cuidador

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Conectar a bases de datos específicas
# Auth Service DB
sqlcmd -S localhost,14400 -U sa -P YourStrong@Passw0rd -d PetCareAuth

# Cuidador Service DB
sqlcmd -S localhost,14405 -U sa -P YourStrong@Passw0rd -d PetCareCuidador

# Usar script de gestión de bases de datos
.\scripts\manage-databases.ps1 start
.\scripts\manage-databases.ps1 stop
.\scripts\manage-databases.ps1 logs
.\scripts\manage-databases.ps1 connect-auth
.\scripts\manage-databases.ps1 connect-cuidador

# Iniciar solo las bases de datos para diagnóstico
.\scripts\start-databases-only.ps1
```

### Desarrollo Local
```bash
# Ejecutar Auth Service
cd auth-service/PetCare.Auth
dotnet run

# Aplicar migraciones
dotnet ef database update

# Crear migración
dotnet ef migrations add NombreMigracion
```

## 🗄️ Configuración de Base de Datos

### Docker
#### Auth Service
- **SQL Server:** `localhost:14400`
- **Usuario:** `sa`
- **Contraseña:** `YourStrong@Passw0rd`
- **Base de datos:** `PetCareAuth` (se crea automáticamente)
- **Contenedor:** `db-auth`

#### Cuidador Service
- **SQL Server:** `localhost:14405`
- **Usuario:** `sa`
- **Contraseña:** `YourStrong@Passw0rd`
- **Base de datos:** `PetCareCuidador` (se crea automáticamente)
- **Contenedor:** `db-cuidador`

#### Cliente Service
- **SQL Server:** `localhost:14410`
- **Usuario:** `sa`
- **Contraseña:** `YourStrong@Passw0rd`
- **Base de datos:** `PetCareCliente` (se crea automáticamente)
- **Contenedor:** `db-cliente`

#### Request Service
- **SQL Server:** `localhost:14415`
- **Usuario:** `sa`
- **Contraseña:** `YourStrong@Passw0rd`
- **Base de datos:** `PetCareRequest` (se crea automáticamente)
- **Contenedor:** `db-request`

### Desarrollo Local
- **SQL Server:** `localhost:1433`
- **Usuario:** `sa`
- **Contraseña:** `pon la contraseña de tu SQL Server local aquí`
- **Base de datos:** `PetCareAuth`, `PetCareCuidador`, `PetCareCliente`, `PetCareRequest` (se crean automáticamente)

## 🔒 Seguridad

- **Autenticación:** JWT con expiración configurable
- **Contraseñas:** Hasheadas con ASP.NET Core Identity
- **Roles:** Cliente, Cuidador, Admin
- **CORS:** Configurado para desarrollo
- **Validación:** Data Annotations en todos los DTOs

## 🌐 Puertos y URLs

### Desarrollo Local
| Servicio | Puerto HTTP | Puerto HTTPS | Swagger UI |
|----------|-------------|--------------|------------|
| **Auth Service** | 5001 | 7001 | http://localhost:5001/swagger |
| **Cuidador Service** | 5044 | 7044 | http://localhost:5044/swagger |
| **Cliente Service** | 5009 | 7009 | http://localhost:5009/swagger |
| **Request Service** | 5128 | 7254 | http://localhost:5128/swagger |

### Docker
| Servicio | Puerto | Swagger UI |
|----------|--------|------------|
| **Auth Service** | 5001 | http://localhost:5001/swagger |
| **Cuidador Service** | 5008 | http://localhost:5008/swagger |
| **Cliente Service** | 5009 | http://localhost:5009/swagger |
| **Request Service** | 5128 | http://localhost:5128/swagger |

### Base de Datos (Docker)
| Servicio | Puerto | Base de Datos |
|----------|--------|---------------|
| **Auth DB** | 14400 | PetCareAuth |
| **Cuidador DB** | 14405 | PetCareCuidador |
| **Cliente DB** | 14410 | PetCareCliente |
| **Request DB** | 14415 | PetCareRequest |

## 🧪 Testing

### Endpoints de Prueba
```bash
# Probar que los servicios funcionan
curl http://localhost:5001/api/auth/test
curl http://localhost:5044/api/cuidador/test
curl http://localhost:5009/api/cliente/test
curl http://localhost:5128/api/solicitud/test

# Swagger UI
# http://localhost:5001/swagger  (Auth)
# http://localhost:5044/swagger  (Cuidador)
# http://localhost:5009/swagger  (Cliente)
# http://localhost:5128/swagger  (Request)
```

### Archivos de Prueba
- `auth-service/PetCare.Auth/PetCare.Auth.http` - Colección de requests para testing

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Contenedor Docker Se Cae
```bash
# Ver logs detallados
docker-compose logs -f petcare-auth

# Reconstruir sin cache
docker-compose build --no-cache petcare-auth
```

#### 2. Error de Conexión a Base de Datos
```bash
# Verificar SQL Server
docker-compose logs db-auth
docker-compose logs db-cuidador

# Probar conexión
sqlcmd -S localhost,14400 -U sa -P YourStrong@Passw0rd -Q "SELECT 1"
sqlcmd -S localhost,14405 -U sa -P YourStrong@Passw0rd -Q "SELECT 1"

# Usar script de diagnóstico
.\scripts\start-databases-only.ps1
```

#### 3. Swagger No Funciona
```bash
# Verificar que el servicio esté corriendo
curl http://localhost:5043/api/auth/test

# Verificar logs
docker-compose logs petcare-auth
```

## 📝 Roadmap

| Funcionalidad                      | Auth Service | Cuidador Service | Cliente Service | Request Service | Chat Service | Rating Service |
|------------------------------------|:------------:|:----------------:|:--------------:|:--------------:|:-----------:|:-------------:|
| **Estructura del Proyecto**        | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **Base de Datos**                  | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **Docker & Docker Compose**        | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **Migraciones Automáticas**        | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **Autenticación JWT**              | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **Swagger con Bearer**             | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **CRUD Básico**                    | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **Gestión de Roles**               | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **Verificación de Documentos**     | ❌           | ✅               | ✅             | ❌             | ❌          | ❌            |
| **Gestión de Perfiles**            | ✅           | ✅               | ✅             | ❌             | ❌          | ❌            |
| **Gestión de Solicitudes**         | ❌           | ❌               | ❌             | ✅             | ❌          | ❌            |
| **Flujo de Servicios**             | ❌           | ❌               | ❌             | ✅             | ❌          | ❌            |
| **Controladores por Rol**          | ❌           | ❌               | ❌             | ✅             | ❌          | ❌            |
| **Notificaciones**                 | ❌           | ❌               | ❌             | ❌             | ❌          | ❌            |
| **Tests Unitarios**                | ❌           | ❌               | ❌             | ❌             | ❌          | ❌            |
| **CI/CD Pipeline**                 | ❌           | ❌               | ❌             | ❌             | ❌          | ❌            |
| **Documentación API**              | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |
| **Scripts de Gestión**             | ✅           | ✅               | ✅             | ✅             | ❌          | ❌            |

### 📊 Resumen por Servicio

#### ✅ **Auth Service** - Completado
- [x] Registro y login de usuarios
- [x] Gestión de roles (Admin, Cliente, Cuidador)
- [x] JWT con expiración configurable
- [x] Reset de contraseñas
- [x] Base de datos separada (PetCareAuth)
- [x] Migraciones automáticas
- [x] Swagger con autenticación

#### ✅ **Cuidador Service** - Completado
- [x] CRUD completo de perfiles
- [x] Autenticación JWT integrada
- [x] Gestión de perfiles personales
- [x] Verificación de documentos (Admin)
- [x] Base de datos separada (PetCareCuidador)
- [x] Migraciones automáticas
- [x] Swagger con autenticación Bearer
- [x] Validaciones de datos
- [x] Soft delete
- [ ] Aceptar/Rechazar Peticiones (pendiente)
- [ ] Iniciar/Finalizar Servicios (pendiente)

#### ✅ **Cliente Service** - Completado
- [x] CRUD completo de perfiles
- [x] Autenticación JWT integrada
- [x] Gestión de perfiles personales
- [x] Verificación de documentos (Admin)
- [x] Base de datos separada (PetCareCliente)
- [x] Migraciones automáticas
- [x] Swagger con autenticación Bearer
- [x] Validaciones de datos
- [x] Soft delete
- [x] Scripts de gestión de contenedores

#### ✅ **Request Service** - Completado
- [x] Gestión completa de solicitudes de servicios
- [x] Controladores separados por rol (Cliente, Cuidador, Admin)
- [x] Flujo completo de solicitudes (Crear → Asignar → Aceptar → Ejecutar → Finalizar)
- [x] Autenticación JWT con autorización por roles
- [x] Base de datos separada (PetCareRequest)
- [x] Migraciones automáticas
- [x] Swagger organizado por controladores
- [x] Validaciones de estado y propiedad de recursos
- [x] Estados de solicitud (Pendiente, Asignada, Aceptada, En Progreso, Finalizada, Cancelada, Rechazada)
- [x] Asignación de cuidadores por cliente y admin
- [x] Gestión de fechas de servicio
- [x] Documentación completa con ejemplos

#### 📋 **Servicios Futuros**
- **Chat Service** - Comunicación entre usuarios
- **Rating Service** - Sistema de calificaciones

### 🎯 **Próximas Prioridades**
1. **Chat Service** - Sistema de mensajería entre usuarios
2. **Rating Service** - Sistema de calificaciones y reseñas
3. **Tests Unitarios** - Cobertura de pruebas
4. **CI/CD Pipeline** - Automatización de despliegue
5. **Notificaciones** - Sistema de alertas en tiempo real
6. **Dashboard Admin** - Panel de administración
7. **Métricas y Analytics** - Reportes y estadísticas

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**¡Gracias por usar PetCare Solution! 🐾**