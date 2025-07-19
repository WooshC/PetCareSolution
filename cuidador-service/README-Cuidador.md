# PetCare Cuidador Service 🏥

Servicio de microservicios para la gestión de perfiles de cuidadores de mascotas

## 📋 Descripción

El Cuidador Service es parte de la arquitectura de microservicios de PetCare Solution. Se encarga de gestionar los perfiles de los cuidadores profesionales que ofrecen servicios de cuidado de mascotas.

## 🏗️ Estructura del Proyecto

```
cuidador-service/
├── PetCare.Cuidador/
│   ├── Controllers/
│   │   └── CuidadorController.cs      # 🎮 Controlador principal
│   ├── Data/
│   │   └── CuidadorDbContext.cs       # 🗄️ Contexto de base de datos
│   ├── Models/
│   │   └── Cuidadores/
│   │       ├── Cuidador.cs            # 📊 Entidad principal
│   │       └── CuidadorRequest.cs     # 📝 DTOs de request/response
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   └── ICuidadorService.cs    # 🔌 Interfaz del servicio
│   │   └── CuidadorService.cs         # ⚙️ Implementación del servicio
│   ├── Config/
│   │   └── AutoMapperProfile.cs       # 🗺️ Configuración de mapeo
│   ├── appsettings.json               # ⚙️ Configuración principal
│   ├── appsettings.Development.json   # ⚙️ Configuración desarrollo
│   ├── appsettings.Docker.json        # ⚙️ Configuración Docker
│   ├── Program.cs                     # 🚀 Punto de entrada
│   ├── Dockerfile                     # 🐳 Configuración Docker
│   └── PetCare.Cuidador.http          # 🧪 Archivo de pruebas
└── README-Cuidador.md                 # 📖 Esta documentación
```

## 🚀 Funcionalidades

### ✅ Implementadas
- **CRUD Completo** de perfiles de cuidadores
- **Autenticación JWT** para todas las operaciones
- **Gestión de perfiles personales** (mi-perfil)
- **Verificación de documentos** (solo administradores)
- **Soft Delete** para eliminación segura
- **Validaciones** de datos y reglas de negocio
- **AutoMapper** para mapeo entre entidades y DTOs
- **Migraciones automáticas** de Entity Framework
- **Swagger/OpenAPI** para documentación

### 🔄 Características Técnicas
- **Base de datos separada** (PetCareCuidador)
- **Arquitectura limpia** con separación de responsabilidades
- **Inyección de dependencias** configurada
- **Logging** detallado para debugging
- **CORS** configurado para desarrollo
- **Reintentos automáticos** para migraciones

## 🛠️ Tecnologías Utilizadas

- **Backend:** ASP.NET Core 8.0
- **Base de Datos:** SQL Server
- **ORM:** Entity Framework Core
- **Autenticación:** JWT Bearer Token
- **Mapeo:** AutoMapper
- **Documentación:** Swagger/OpenAPI
- **Contenedores:** Docker

## 📊 Modelo de Datos

### Entidad Cuidador
```csharp
public class Cuidador
{
    public int CuidadorID { get; set; }           // Clave primaria
    public int UsuarioID { get; set; }            // Referencia al Auth Service
    public string DocumentoIdentidad { get; set; } // Documento único
    public string TelefonoEmergencia { get; set; } // Teléfono de contacto
    public string? Biografia { get; set; }        // Descripción personal
    public string? Experiencia { get; set; }      // Experiencia profesional
    public string? HorarioAtencion { get; set; }  // Horarios disponibles
    public decimal? TarifaPorHora { get; set; }   // Precio por hora
    public decimal CalificacionPromedio { get; set; } // Rating promedio
    public bool DocumentoVerificado { get; set; } // Estado de verificación
    public DateTime? FechaVerificacion { get; set; } // Fecha de verificación
    public string Estado { get; set; }            // Activo/Eliminado
    public DateTime FechaCreacion { get; set; }   // Fecha de registro
    public DateTime? FechaActualizacion { get; set; } // Última actualización
}
```

## 🔌 Endpoints Disponibles

### 🔓 Públicos
- `GET /api/cuidador/test` - Endpoint de prueba

### 🔐 Autenticados
- `GET /api/cuidador` - Obtener todos los cuidadores
- `GET /api/cuidador/{id}` - Obtener cuidador específico
- `GET /api/cuidador/mi-perfil` - Obtener mi perfil de cuidador
- `POST /api/cuidador` - Crear perfil de cuidador
- `PUT /api/cuidador/mi-perfil` - Actualizar mi perfil

### 👑 Administradores
- `PUT /api/cuidador/{id}` - Actualizar cuidador específico
- `DELETE /api/cuidador/{id}` - Eliminar cuidador
- `POST /api/cuidador/{id}/verificar` - Verificar documento

## 🔐 Flujo de Autenticación Completo

### 1. Obtener Token JWT del Auth Service
```bash
# Login en el Auth Service
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cuidador@ejemplo.com",
    "password": "Password123!"
  }'

# Respuesta esperada:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expiresIn": 604800,
#   "user": { ... }
# }
```

### 2. Usar Token en Cuidador Service
```bash
# Crear perfil de cuidador
curl -X POST http://localhost:5008/api/cuidador \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "documentoIdentidad": "12345678",
    "telefonoEmergencia": "3001234567",
    "biografia": "Soy un cuidador profesional...",
    "experiencia": "He trabajado con perros, gatos...",
    "horarioAtencion": "Lunes a Viernes 8:00 AM - 6:00 PM",
    "tarifaPorHora": 25.50
  }'
```

### 3. Verificar Autorización
- **Token válido**: Endpoints responden con datos
- **Token inválido**: Error 401 Unauthorized
- **Token expirado**: Error 401 Unauthorized

## 🚀 Inicio Rápido

### 🐳 Con Docker (Recomendado)

#### Prerrequisitos:
- Docker Desktop instalado y corriendo
- PetCare Auth Service corriendo (para autenticación)

#### Pasos:
```bash
# 1. Navegar al directorio del servicio
cd cuidador-service/PetCare.Cuidador

# 2. Construir y ejecutar con Docker
docker build -t petcare-cuidador .
docker run -p 5008:8080 --name petcare-cuidador petcare-cuidador

# 3. Verificar que el servicio esté corriendo
curl http://localhost:5008/api/cuidador/test
```

### 🖥️ Desarrollo Local

#### Prerrequisitos:
- .NET 8.0 SDK
- SQL Server local en puerto 1433
- PetCare Auth Service corriendo

#### Pasos:
```bash
# 1. Navegar al directorio del servicio
cd cuidador-service/PetCare.Cuidador

# 2. Restaurar dependencias
dotnet restore

# 3. Ejecutar el servicio
dotnet run

# 4. Acceder a Swagger
# http://localhost:5008/swagger
```

## 📚 Uso de los Endpoints

### 1. Crear Perfil de Cuidador
```bash
# Primero obtener token del Auth Service
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "cuidador@ejemplo.com", "password": "Password123!"}'

# Crear perfil de cuidador
curl -X POST http://localhost:5008/api/cuidador \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "documentoIdentidad": "12345678",
    "telefonoEmergencia": "3001234567",
    "biografia": "Soy un cuidador profesional...",
    "experiencia": "He trabajado con perros, gatos...",
    "horarioAtencion": "Lunes a Viernes 8:00 AM - 6:00 PM",
    "tarifaPorHora": 25.50
  }'
```

### 2. Obtener Mi Perfil
```bash
curl -X GET http://localhost:5008/api/cuidador/mi-perfil \
  -H "Authorization: Bearer {token}"
```

### 3. Actualizar Mi Perfil
```bash
curl -X PUT http://localhost:5008/api/cuidador/mi-perfil \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "documentoIdentidad": "12345678",
    "telefonoEmergencia": "3001234567",
    "biografia": "Biografía actualizada...",
    "experiencia": "Experiencia actualizada...",
    "horarioAtencion": "Horario actualizado",
    "tarifaPorHora": 28.00
  }'
```

### 4. Obtener Todos los Cuidadores
```bash
curl -X GET http://localhost:5008/api/cuidador \
  -H "Authorization: Bearer {token}"
```

## 🗄️ Configuración de Base de Datos

### Docker
- **SQL Server:** `localhost:14400`
- **Usuario:** `sa`
- **Contraseña:** `YourStrong@Passw0rd`
- **Base de datos:** `PetCareCuidador` (se crea automáticamente)

### Desarrollo Local
- **SQL Server:** `localhost:1433`
- **Usuario:** `sa`
- **Contraseña:** `admin1234`
- **Base de datos:** `PetCareCuidador` (se crea automáticamente)

## 🔒 Seguridad

- **Autenticación:** JWT Bearer Token requerido para todos los endpoints
- **Autorización:** Roles específicos para operaciones administrativas
- **Validación:** Data Annotations en todos los DTOs
- **Soft Delete:** Los registros no se eliminan físicamente
- **Documentos únicos:** Validación de duplicados en documentos de identidad

## 🔐 Autenticación en Swagger UI

### Cómo Autorizar en Swagger

1. **Abrir Swagger UI**: Ve a `http://localhost:5008/swagger`

2. **Buscar el botón de autorización**: 
   - En la parte superior derecha de Swagger UI verás un botón con un candado 🔒
   - Haz clic en el botón "Authorize" o el ícono del candado

3. **Insertar el token JWT**:
   - En el campo de autorización, ingresa: `Bearer {tu_token_jwt}`
   - **Ejemplo**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **IMPORTANTE**: Siempre incluye la palabra "Bearer" antes del token

4. **Hacer clic en "Authorize"**:
   - Una vez ingresado el token, haz clic en el botón "Authorize"
   - El candado debería cambiar de color o mostrar que estás autorizado

5. **Probar endpoints**:
   - Ahora puedes probar todos los endpoints que requieren autenticación
   - El token se enviará automáticamente en cada request

### 📸 Imagen de Referencia

> **INSERTAR IMAGEN AQUÍ**: Captura de pantalla mostrando el botón de autorización (candado) en Swagger UI y el modal de autorización con el campo para ingresar el token JWT.

### 🔧 Solución de Problemas de Autorización

#### Error 401 Unauthorized
- **Causa**: Token JWT inválido o expirado
- **Solución**: Obtener un nuevo token del Auth Service

#### Error 401 con token válido
- **Causa**: Falta la palabra "Bearer" antes del token
- **Solución**: Asegúrate de incluir "Bearer " antes del token en Swagger

#### Botón de autorización no aparece
- **Causa**: Configuración incorrecta de Swagger
- **Solución**: Reiniciar el servicio para aplicar la configuración actualizada

#### Swagger genera curl sin "Bearer"
- **Causa**: Configuración de Swagger no actualizada
- **Solución**: 
  1. Detener el servicio (Ctrl+C)
  2. Ejecutar `dotnet run` nuevamente
  3. Verificar que el curl generado incluya "Bearer"

#### Error 400 Bad Request después de autorizar
- **Causa**: Datos del request inválidos
- **Solución**: Verificar que todos los campos requeridos estén presentes y con formato correcto

## 🧪 Testing

### Archivo de Pruebas
El archivo `PetCare.Cuidador.http` contiene ejemplos de todos los endpoints para testing con REST Client.

### Endpoints de Prueba
```bash
# Probar que el servicio funciona
curl http://localhost:5008/api/cuidador/test

# Swagger UI
# http://localhost:5008/swagger
```

### Testing con curl (Alternativa a Swagger)
```bash
# Crear perfil de cuidador con curl
curl -X POST http://localhost:5008/api/cuidador \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "documentoIdentidad": "12345678",
    "telefonoEmergencia": "3001234567",
    "biografia": "Soy un cuidador profesional...",
    "experiencia": "He trabajado con perros, gatos...",
    "horarioAtencion": "Lunes a Viernes 8:00 AM - 6:00 PM",
    "tarifaPorHora": 25.50
  }'
```

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Ejecutar servicio
dotnet run

# Aplicar migraciones
dotnet ef database update

# Crear migración
dotnet ef migrations add NombreMigracion

# Ver migraciones
dotnet ef migrations list
```

### Docker
```bash
# Construir imagen
docker build -t petcare-cuidador .

# Ejecutar contenedor
docker run -p 5008:8080 petcare-cuidador

# Ver logs
docker logs petcare-cuidador

# Detener contenedor
docker stop petcare-cuidador
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar SQL Server
sqlcmd -S localhost,1433 -U sa -P admin1234 -Q "SELECT 1"

# Verificar logs del servicio
dotnet run --verbosity detailed
```

#### 2. Error de Autenticación JWT
```bash
# Verificar que el Auth Service esté corriendo
curl http://localhost:5001/api/auth/test

# Verificar configuración JWT en appsettings.json
```

#### 3. Error de Migraciones
```bash
# Limpiar y recrear migraciones
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 🔄 Flujo de Trabajo

### Crear Perfil de Cuidador
1. **Registrar usuario** en Auth Service con rol "Cuidador"
2. **Obtener token JWT** del Auth Service
3. **Crear perfil** en Cuidador Service usando el token
4. **Verificar documento** (opcional, requiere Admin)

### Actualizar Perfil
1. **Obtener token JWT** del Auth Service
2. **Actualizar perfil** usando endpoint "mi-perfil"
3. **Validar cambios** en la respuesta

## 📝 Notas Importantes

- **Bases de datos separadas:** Cada servicio tiene su propia base de datos
- **Relación por UsuarioID:** La relación con Auth Service es por ID de usuario
- **Soft Delete:** Los registros se marcan como "Eliminado" pero no se borran
- **Documentos únicos:** No se permiten documentos de identidad duplicados
- **Verificación manual:** Los documentos deben ser verificados por administradores
- **Autenticación JWT:** Todos los endpoints requieren token JWT válido (excepto /test)
- **Swagger UI:** Configurado con autenticación Bearer para testing interactivo
- **Headers de autorización:** Siempre incluir "Bearer " antes del token JWT

## 🤝 Integración con Otros Servicios

### Auth Service
- **Dependencia:** Requerido para autenticación
- **Relación:** UsuarioID del token JWT
- **Roles:** Cliente, Cuidador, Admin

### Servicios Futuros
- **Request Service:** Para solicitudes de cuidado
- **Rating Service:** Para calificaciones de cuidadores
- **Chat Service:** Para comunicación entre usuarios

---

**¡Gracias por usar PetCare Cuidador Service! 🏥** 