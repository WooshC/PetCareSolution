# PetCare Request Service

## 📋 Descripción

El **PetCare Request Service** es un microservicio encargado de gestionar las solicitudes de servicios de cuidado de mascotas. Este servicio permite a los clientes crear solicitudes de servicios, a los cuidadores aceptar o rechazar solicitudes, y a los administradores gestionar el flujo completo de las solicitudes.

## 🏗️ Arquitectura

### Tecnologías Utilizadas
- **.NET 8.0** - Framework de desarrollo
- **Entity Framework Core** - ORM para acceso a datos
- **SQL Server** - Base de datos
- **JWT** - Autenticación y autorización
- **AutoMapper** - Mapeo de objetos
- **Swagger/OpenAPI** - Documentación de API
- **Docker** - Containerización

### Estructura del Proyecto
```
PetCare.Request/
├── Controllers/
│   └── SolicitudController.cs          # Controlador principal
├── Data/
│   └── RequestDbContext.cs             # Contexto de base de datos
├── Models/
│   └── Solicitudes/
│       ├── Solicitud.cs                # Modelo de entidad
│       └── SolicitudRequest.cs         # DTOs
├── Services/
│   ├── Interfaces/
│   │   └── ISolicitudService.cs        # Interfaz del servicio
│   └── SolicitudService.cs             # Implementación del servicio
├── Config/
│   └── AutoMapperProfile.cs            # Configuración de AutoMapper
├── Migrations/                         # Migraciones de EF Core
├── Properties/
│   └── launchSettings.json             # Configuración de lanzamiento
├── appsettings.json                    # Configuración local
├── appsettings.Docker.json             # Configuración Docker
├── Dockerfile                          # Configuración Docker
├── Program.cs                          # Punto de entrada
└── PetCare.Request.csproj              # Archivo de proyecto
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- .NET 8.0 SDK
- SQL Server (local o Docker)
- Docker (opcional)

### Configuración Local

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd PetCareSolution/request-service/PetCare.Request
   ```

2. **Restaurar dependencias**
   ```bash
   dotnet restore
   ```

3. **Configurar base de datos**
   - Asegúrate de que SQL Server esté ejecutándose
   - Verifica la cadena de conexión en `appsettings.json`
   - Ejecuta las migraciones:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Ejecutar el servicio**
   ```bash
   dotnet run
   ```

### Configuración Docker

1. **Construir la imagen**
   ```bash
   docker build -t petcare-request .
   ```

2. **Ejecutar el contenedor**
   ```bash
   docker run -p 8080:8080 -e ASPNETCORE_ENVIRONMENT=Docker petcare-request
   ```

## 📊 Base de Datos

### Tabla: Solicitudes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| SolicitudID | INT | Clave primaria, auto-incremento |
| ClienteID | INT | ID del cliente que creó la solicitud |
| CuidadorID | INT | ID del cuidador asignado (nullable) |
| TipoServicio | NVARCHAR(50) | Tipo de servicio (Paseo, Guardería, Visita) |
| Descripcion | TEXT | Descripción detallada del servicio |
| FechaHoraInicio | DATETIME | Fecha y hora de inicio del servicio |
| DuracionHoras | INT | Duración en horas (1-24) |
| Ubicacion | NVARCHAR(200) | Ubicación del servicio |
| Estado | NVARCHAR(20) | Estado actual de la solicitud |
| FechaCreacion | DATETIME | Fecha de creación |
| FechaActualizacion | DATETIME | Última fecha de actualización |
| FechaAceptacion | DATETIME | Fecha de aceptación (nullable) |
| FechaInicioServicio | DATETIME | Fecha de inicio del servicio (nullable) |
| FechaFinalizacion | DATETIME | Fecha de finalización (nullable) |

### Estados de Solicitud
- **Pendiente**: Solicitud creada, esperando asignación
- **Asignada**: Cuidador asignado, esperando aceptación
- **Aceptada**: Cuidador aceptó la solicitud
- **En Progreso**: Servicio iniciado
- **Finalizada**: Servicio completado
- **Cancelada**: Solicitud cancelada
- **Rechazada**: Cuidador rechazó la solicitud
- **Fuera de Tiempo**: Solicitud expirada

## 🔐 Autenticación y Autorización

El servicio utiliza JWT (JSON Web Tokens) para autenticación. Los roles soportados son:

- **Admin**: Acceso completo a todas las funcionalidades
- **Cliente**: Puede crear, ver y gestionar sus propias solicitudes
- **Cuidador**: Puede ver solicitudes asignadas y gestionar su estado

### Headers Requeridos
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📡 API Endpoints

### Endpoints Públicos
- `GET /api/solicitud/test` - Verificar estado del servicio

### Endpoints de Cliente
- `POST /api/solicitud` - Crear nueva solicitud
- `GET /api/solicitud/mis-solicitudes` - Ver mis solicitudes
- `PUT /api/solicitud/{id}` - Actualizar solicitud
- `PUT /api/solicitud/{id}/asignar-cuidador-cliente` - Asignar cuidador a mi solicitud
- `DELETE /api/solicitud/{id}` - Eliminar solicitud
- `POST /api/solicitud/{id}/cancelar` - Cancelar solicitud

### Endpoints de Cuidador
- `GET /api/solicitud/mis-solicitudes` - Ver mis solicitudes asignadas
- `POST /api/solicitud/{id}/aceptar` - Aceptar solicitud
- `POST /api/solicitud/{id}/rechazar` - Rechazar solicitud
- `POST /api/solicitud/{id}/iniciar-servicio` - Iniciar servicio
- `POST /api/solicitud/{id}/finalizar-servicio` - Finalizar servicio

### Endpoints de Administrador
- `GET /api/solicitud` - Ver todas las solicitudes
- `GET /api/solicitud/estado/{estado}` - Filtrar por estado
- `PUT /api/solicitud/{id}/asignar-cuidador` - Asignar cuidador (admin)
- `PUT /api/solicitud/{id}/estado` - Cambiar estado manualmente

### Endpoints Generales
- `GET /api/solicitud/{id}` - Ver solicitud específica
- `GET /api/solicitud/cliente/{clienteId}` - Ver solicitudes de cliente
- `GET /api/solicitud/cuidador/{cuidadorId}` - Ver solicitudes de cuidador

## 🔄 Flujo Completo del Sistema

### 1. Creación de Solicitud
1. **Cliente crea solicitud** → `POST /api/solicitud`
   - El `ClienteID` se extrae automáticamente del token JWT
   - Estado inicial: `"Pendiente"`

### 2. Asignación de Cuidador
2. **Cliente asigna cuidador** → `PUT /api/solicitud/{id}/asignar-cuidador-cliente`
   - El cliente selecciona un cuidador específico
   - Estado cambia a: `"Asignada"`

### 3. Gestión por Cuidador
3. **Cuidador acepta/rechaza** → `POST /api/solicitud/{id}/aceptar` o `/rechazar`
   - Si acepta: Estado → `"Aceptada"`
   - Si rechaza: Estado → `"Rechazada"`

### 4. Ejecución del Servicio
4. **Cuidador inicia servicio** → `POST /api/solicitud/{id}/iniciar-servicio`
   - Estado cambia a: `"En Progreso"`

5. **Cuidador finaliza servicio** → `POST /api/solicitud/{id}/finalizar-servicio`
   - Estado cambia a: `"Finalizada"`

### 5. Gestión Administrativa (Opcional)
- **Admin puede asignar cuidador** → `PUT /api/solicitud/{id}/asignar-cuidador`
- **Admin puede cambiar estado** → `PUT /api/solicitud/{id}/estado`

## 📝 Ejemplos de Uso

### Crear una Solicitud
```http
POST /api/solicitud
Authorization: Bearer <token>
Content-Type: application/json

{
  "tipoServicio": "Paseo",
  "descripcion": "Necesito que alguien pasee a mi perro por 2 horas",
  "fechaHoraInicio": "2024-01-15T10:00:00Z",
  "duracionHoras": 2,
  "ubicacion": "Parque Central, Ciudad"
}
```

**Nota**: El `ClienteID` se extrae automáticamente del token JWT. No es necesario enviarlo en el body de la petición.

### Asignar Cuidador (Cliente)
```http
PUT /api/solicitud/1/asignar-cuidador-cliente
Authorization: Bearer <cliente_token>
Content-Type: application/json

{
  "cuidadorID": 1
}
```

### Asignar Cuidador (Admin)
```http
PUT /api/solicitud/1/asignar-cuidador
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "cuidadorID": 1
}
```

### Aceptar Solicitud
```http
POST /api/solicitud/1/aceptar
Authorization: Bearer <cuidador_token>
```

## 🔧 Configuración

### Variables de Entorno
- `ASPNETCORE_ENVIRONMENT`: Entorno de ejecución (Development/Docker)
- `ConnectionStrings__Default`: Cadena de conexión a la base de datos
- `Jwt__Key`: Clave secreta para JWT
- `Jwt__Issuer`: Emisor del token JWT
- `Jwt__Audience`: Audiencia del token JWT

### Puertos
- **Desarrollo**: 5128 (HTTP), 7254 (HTTPS)
- **Docker**: 8080

## 🧪 Testing

### Ejecutar Tests
```bash
dotnet test
```

### Probar Endpoints
Utiliza el archivo `PetCare.Request.http` para probar los endpoints con REST Client.

### Swagger UI
Accede a la documentación interactiva en: `http://localhost:5128/swagger`

## 🐳 Docker

### Construir Imagen
```bash
docker build -t petcare-request .
```

### Ejecutar Contenedor
```bash
docker run -d \
  --name petcare-request \
  -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Docker \
  petcare-request
```

### Docker Compose
El servicio está incluido en el `docker-compose.yml` principal del proyecto.

## 📈 Monitoreo y Logs

### Logs de Aplicación
Los logs se escriben en la consola con diferentes niveles:
- 🔧 Configuración
- 🔄 Migraciones
- 📊 Base de datos
- 🚀 Inicio de aplicación
- ⚠️ Advertencias
- ❌ Errores

### Métricas
- Tiempo de respuesta de endpoints
- Número de solicitudes por estado
- Errores de autenticación/autorización

## 🔒 Seguridad

### Validaciones
- Autenticación JWT obligatoria
- Autorización basada en roles
- Validación de propiedad de recursos
- Validación de estados de solicitud
- Sanitización de datos de entrada

### Buenas Prácticas
- Uso de HTTPS en producción
- Validación de tokens JWT
- Control de acceso granular
- Logs de auditoría
- Manejo seguro de errores

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de conexión a base de datos**
   - Verificar que SQL Server esté ejecutándose
   - Comprobar la cadena de conexión
   - Ejecutar migraciones: `dotnet ef database update`

2. **Error de autenticación JWT**
   - Verificar que el token sea válido
   - Comprobar la configuración JWT en appsettings
   - Verificar que el token no haya expirado

3. **Error de migraciones**
   - Eliminar migraciones existentes: `dotnet ef migrations remove`
   - Crear nueva migración: `dotnet ef migrations add InitialCreate`
   - Aplicar migración: `dotnet ef database update`

### Logs de Debug
Para habilitar logs detallados, modifica `appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  }
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo
- Revisar la documentación de la API en Swagger

---

**PetCare Request Service** - Gestionando solicitudes de cuidado de mascotas de manera eficiente y segura. 🐾 