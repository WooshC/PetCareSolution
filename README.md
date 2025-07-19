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
├── cliente-service/        # 👤 Servicio de Clientes (Futuro)
├── cuidador-service/       # 🏥 Servicio de Cuidadores (Futuro)
├── request-service/        # 📋 Servicio de Solicitudes (Futuro)
├── chat-service/          # 💬 Servicio de Chat (Futuro)
├── rating-service/        # ⭐ Servicio de Calificaciones (Futuro)
├── docker-compose.yml     # 🐳 Configuración de Docker
└── PetCare.sln           # 🎯 Solución principal
```

## 🚀 Servicios Implementados

### ✅ Auth Service (Completado)
- **Ubicación:** `auth-service/PetCare.Auth/`
- **Documentación:** [README-Auth.md](auth-service/README-Auth.md)
- **Funcionalidades:**
  - Registro de usuarios (Cliente/Cuidador)
  - Autenticación JWT
  - Gestión de roles
  - Reset de contraseñas
  - Endpoints de desarrollo y testing

### ✅ Cuidador Service (Completado)
- **Ubicación:** `cuidador-service/PetCare.Cuidador/`
- **Documentación:** [README-Cuidador.md](cuidador-service/README-Cuidador.md)
- **Funcionalidades:**
  - CRUD completo de perfiles de cuidadores
  - Autenticación JWT integrada
  - Gestión de perfiles personales
  - Verificación de documentos (Admin)
  - Endpoints de desarrollo y testing

### 🔄 Servicios Futuros
- **Cliente Service** - Gestión de perfiles de clientes
- **Request Service** - Solicitudes de cuidado
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
git clone <repository-url>
cd PetCareSolution

# 2. Ejecutar con Docker Compose
docker-compose up -d

# 3. Verificar que los servicios estén corriendo
docker-compose ps

# 4. Acceder a los servicios
# Auth Service: http://localhost:5001/swagger
# Cuidador Service: http://localhost:5008/swagger
# SQL Server: localhost:14400
```

#### Verificación:
```bash
# Ver logs en tiempo real
docker-compose logs -f petcare-auth

# Verificar estado de contenedores
docker-compose ps

# Probar endpoint de prueba
curl http://localhost:5001/api/auth/test
```

### 🖥️ Desarrollo Local

#### Prerrequisitos:
- .NET 8.0 SDK
- SQL Server local en puerto 1433
- Usuario SA con contraseña `admin1234`

#### Pasos:
```bash
# 1. Configurar SQL Server local
# - Instalar SQL Server
# - Configurar usuario SA con contraseña admin1234

# 2. Ejecutar Auth Service localmente
cd auth-service/PetCare.Auth
set ASPNETCORE_ENVIRONMENT=Development
dotnet run

# 3. Acceder a Swagger
# http://localhost:5042/swagger
```

## 📚 Documentación por Servicio

### 🔐 Auth Service
- **Documentación completa:** [README-Auth.md](auth-service/README-Auth.md)
- **Endpoints principales:**
  - `POST /api/auth/register` - Registro de usuarios
  - `POST /api/auth/login` - Inicio de sesión
  - `GET /api/auth/users` - Lista de usuarios (desarrollo)
  - `GET /api/auth/test` - Endpoint de prueba

### 🏥 Cuidador Service
- **Documentación completa:** [README-Cuidador.md](cuidador-service/README-Cuidador.md)
- **Endpoints principales:**
  - `GET /api/cuidador` - Lista de cuidadores
  - `GET /api/cuidador/mi-perfil` - Mi perfil de cuidador
  - `POST /api/cuidador` - Crear perfil de cuidador
  - `PUT /api/cuidador/mi-perfil` - Actualizar mi perfil
  - `GET /api/cuidador/test` - Endpoint de prueba

### 🔄 Servicios Futuros
- **Cliente Service** - Documentación pendiente
- **Request Service** - Documentación pendiente
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

# Reconstruir un servicio
docker-compose build --no-cache petcare-auth
docker-compose build --no-cache petcare-cuidador

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
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
- **SQL Server:** `localhost:14400`
- **Usuario:** `sa`
- **Contraseña:** `YourStrong@Passw0rd`
- **Base de datos:** `PetCareAuth` (se crea automáticamente)

### Desarrollo Local
- **SQL Server:** `localhost:1433`
- **Usuario:** `sa`
- **Contraseña:** `admin1234`
- **Base de datos:** `PetCareAuth` (se crea automáticamente)

## 🔒 Seguridad

- **Autenticación:** JWT con expiración configurable
- **Contraseñas:** Hasheadas con ASP.NET Core Identity
- **Roles:** Cliente, Cuidador, Admin
- **CORS:** Configurado para desarrollo
- **Validación:** Data Annotations en todos los DTOs

## 🧪 Testing

### Endpoints de Prueba
```bash
# Probar que el servicio funciona
curl http://localhost:5001/api/auth/test

# Obtener lista de usuarios (desarrollo)
curl http://localhost:5001/api/auth/users

# Swagger UI
# http://localhost:5001/swagger
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
docker-compose logs db

# Probar conexión
sqlcmd -S localhost,14400 -U sa -P YourStrong@Passw0rd -Q "SELECT 1"
```

#### 3. Swagger No Funciona
```bash
# Verificar que el servicio esté corriendo
curl http://localhost:5001/api/auth/test

# Verificar logs
docker-compose logs petcare-auth
```

## 📝 Roadmap

### ✅ Completado
- [x] Estructura del proyecto
- [x] Auth Service con JWT
- [x] Cuidador Service con CRUD completo
- [x] Configuración Docker
- [x] Migraciones automáticas
- [x] Documentación básica

### 🔄 En Progreso
- [ ] Cliente Service
- [ ] Request Service

### 📋 Pendiente
- [ ] Chat Service
- [ ] Rating Service
- [ ] Tests unitarios
- [ ] CI/CD pipeline
- [ ] Documentación completa

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