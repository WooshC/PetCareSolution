# PetCare Chat Service 💬

Servicio de chat en tiempo real para PetCare Solution

## 📋 Descripción

El Chat Service es un microservicio que proporciona funcionalidades de mensajería en tiempo real entre usuarios de PetCare Solution. Utiliza SignalR con WebSockets para la comunicación instantánea y Entity Framework Core para el almacenamiento persistente de mensajes.

**🔒 Característica Especial:** La comunicación solo se permite cuando existe una solicitud activa entre cliente y cuidador con estados que permiten comunicación.

## 🏗️ Estructura del Proyecto

```
chat-service/
├── PetCare.Chat/
│   ├── Controllers/
│   │   └── ChatController.cs           # Controlador REST API
│   ├── Data/
│   │   └── ChatDbContext.cs            # Contexto de base de datos
│   ├── Hubs/
│   │   └── ChatHub.cs                  # Hub de SignalR
│   ├── Models/
│   │   └── Chat/
│   │       └── ChatMessage.cs          # Modelos de datos
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   └── IChatService.cs         # Interfaz del servicio
│   │   └── ChatService.cs              # Implementación del servicio
│   ├── Config/
│   │   └── AutoMapperProfile.cs        # Configuración de mapeo
│   ├── appsettings.json                # Configuración principal
│   ├── appsettings.Docker.json         # Configuración Docker
│   ├── Program.cs                      # Punto de entrada
│   ├── Dockerfile                      # Configuración Docker
│   └── PetCare.Chat.http               # Archivo de pruebas
└── README-Chat.md                      # Esta documentación
```

## 🚀 Funcionalidades

### ✅ Implementadas
- **Mensajería en tiempo real** con SignalR y WebSockets
- **Validación de comunicación** basada en estado de solicitud
- **Almacenamiento persistente** de mensajes en SQL Server
- **Autenticación JWT** integrada con el Auth Service
- **Gestión de conversaciones** entre usuarios
- **Estado de lectura** de mensajes
- **Tipos de mensaje** (Texto, Imagen, Archivo)
- **Eliminación de mensajes** (solo por el remitente)
- **API REST completa** para operaciones CRUD
- **Base de datos separada** (PetCareChat)
- **Migraciones automáticas**
- **Swagger con autenticación Bearer**
- **Comunicación inter-servicios** con Request Service

### 🔄 Futuras
- **Notificaciones push** para mensajes no leídos
- **Archivos adjuntos** con almacenamiento en la nube
- **Grupos de chat** para múltiples usuarios
- **Mensajes de voz** y videollamadas
- **Encriptación end-to-end** de mensajes

## 🔒 Validación de Comunicación

### Estados de Solicitud que Permiten Comunicación
- **✅ Asignada** - Cliente asignó cuidador
- **✅ Aceptada** - Cuidador aceptó la solicitud  
- **✅ En Progreso** - Servicio en ejecución

### Estados de Solicitud que NO Permiten Comunicación
- **❌ Pendiente** - No asignada
- **❌ Rechazada** - Cuidador rechazó
- **❌ Finalizada** - Servicio completado
- **❌ Cancelada** - Cliente canceló

### Flujo de Validación
1. **Cliente crea solicitud** → Estado: "Pendiente" (❌ No comunicación)
2. **Cliente asigna cuidador** → Estado: "Asignada" (✅ Comunicación habilitada)
3. **Cuidador acepta** → Estado: "Aceptada" (✅ Comunicación continua)
4. **Cuidador inicia servicio** → Estado: "En Progreso" (✅ Comunicación continua)
5. **Cuidador finaliza** → Estado: "Finalizada" (❌ Comunicación deshabilitada)

## 🛠️ Tecnologías Utilizadas

- **Backend:** ASP.NET Core 8.0
- **Tiempo Real:** SignalR con WebSockets
- **Base de Datos:** SQL Server
- **ORM:** Entity Framework Core
- **Autenticación:** JWT + Bearer Token
- **Mapeo:** AutoMapper
- **Contenedores:** Docker & Docker Compose
- **Documentación:** Swagger/OpenAPI
- **Comunicación Inter-servicios:** HTTP Client

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

# 3. Verificar que el servicio esté corriendo
docker-compose ps petcare-chat

# 4. Acceder al servicio
# Chat Service: http://localhost:5011/swagger
# SignalR Hub: http://localhost:5011/chatHub

# 5. Verificar que funciona
curl http://localhost:5011/api/chat/test
```

### 🖥️ Desarrollo Local

#### Prerrequisitos:
- .NET 8.0 SDK
- SQL Server local en puerto 1433
- Usuario SA con contraseña

#### Pasos:
```bash
# 1. Configurar SQL Server local
# - Instalar SQL Server
# - Configurar usuario SA con la contraseña correspondiente

# 2. Ejecutar el servicio
cd chat-service/PetCare.Chat
dotnet run

# 3. Aplicar migraciones (si es necesario)
dotnet ef database update
```

## 🌐 Resumen de Puertos

### 🖥️ Desarrollo Local
| Servicio | Puerto HTTP | Puerto HTTPS | Swagger | SignalR Hub |
|----------|-------------|--------------|---------|-------------|
| **Chat Service** | 5086 | 7054 | http://localhost:5086/swagger | http://localhost:5086/chatHub |

### 🐳 Docker
| Servicio | Puerto | Swagger | SignalR Hub |
|----------|--------|---------|-------------|
| **Chat Service** | 5011 | http://localhost:5011/swagger | http://localhost:5011/chatHub |

### 🗄️ Base de Datos
| Servicio | Puerto Docker | Puerto Local |
|----------|---------------|--------------|
| **Chat DB** | 14420 | 1433 |

## 📚 Documentación de API

### 🔓 Endpoints Públicos
- `GET /api/chat/test` - Verificar estado del servicio
- `GET /api/chat/estados-comunicacion` - Estados que permiten comunicación

### 🔐 Endpoints Autenticados
- `POST /api/chat/send` - Enviar mensaje (con validación automática)
- `GET /api/chat/conversation/{otherUserId}` - Obtener conversación
- `GET /api/chat/conversations` - Obtener todas las conversaciones
- `POST /api/chat/validate-communication` - Validar si se puede comunicar
- `GET /api/chat/validate-solicitud/{solicitudId}` - Validar por solicitud específica
- `GET /api/chat/active-conversations` - Obtener conversaciones activas
- `POST /api/chat/mark-read` - Marcar mensajes como leídos
- `GET /api/chat/unread-count` - Obtener cantidad de mensajes no leídos
- `GET /api/chat/recent` - Obtener mensajes recientes
- `DELETE /api/chat/message/{messageId}` - Eliminar mensaje

### 🔗 SignalR Hub
- **URL:** `/chatHub`
- **Métodos:**
  - `SendMessage(ChatMessageRequest)` - Enviar mensaje en tiempo real
  - `ValidateCommunication(CommunicationValidationRequest)` - Validar comunicación
  - `GetActiveConversations()` - Obtener conversaciones activas
  - `MarkAsRead(int senderId)` - Marcar mensajes como leídos
  - `JoinConversation(int otherUserId)` - Unirse a conversación
  - `LeaveConversation(int otherUserId)` - Salir de conversación

### 📡 Eventos SignalR
- `ReceiveMessage(ChatMessageResponse)` - Recibir mensaje nuevo
- `MessageSent(ChatMessageResponse)` - Confirmar mensaje enviado
- `CommunicationValidated(CommunicationValidationResponse)` - Resultado de validación
- `ActiveConversations(List<CommunicationValidationResponse>)` - Conversaciones activas
- `MessagesRead(int userId)` - Notificar mensajes leídos
- `Error(string message)` - Error en operación

## 📊 Estructura de Base de Datos

### Tabla: ChatMessages
| Campo | Tipo | Descripción |
|-------|------|-------------|
| MessageID | INT | Clave primaria (auto-increment) |
| SenderID | INT | ID del usuario remitente |
| ReceiverID | INT | ID del usuario destinatario |
| Content | NVARCHAR(1000) | Contenido del mensaje |
| MessageType | NVARCHAR(50) | Tipo de mensaje (Text, Image, File) |
| IsRead | BIT | Estado de lectura |
| Timestamp | DATETIME2 | Fecha y hora del mensaje |
| AttachmentUrl | NVARCHAR(500) | URL del archivo adjunto (nullable) |
| AttachmentName | NVARCHAR(200) | Nombre del archivo adjunto (nullable) |
| SolicitudID | INT | ID de la solicitud relacionada (nullable) |
| SolicitudEstado | NVARCHAR(50) | Estado de la solicitud (nullable) |

### Índices
- `IX_ChatMessages_SenderID_ReceiverID` - Para búsquedas de conversación
- `IX_ChatMessages_ReceiverID_IsRead` - Para mensajes no leídos
- `IX_ChatMessages_Timestamp` - Para ordenamiento por fecha

## 🔐 Autenticación y Autorización

El servicio utiliza JWT (JSON Web Tokens) para autenticación. Los tokens se obtienen del Auth Service.

### Headers Requeridos
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Para SignalR
```
?access_token=<jwt_token>
```

## 📝 Ejemplos de Uso

### Validar Comunicación
```http
POST /api/chat/validate-communication
Authorization: Bearer <token>
Content-Type: application/json

{
  "otherUserID": 2,
  "solicitudID": 1
}
```

### Enviar Mensaje (REST API)
```http
POST /api/chat/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverID": 2,
  "content": "Hola, ¿cómo estás?",
  "messageType": "Text",
  "solicitudID": 1
}
```

### Enviar Mensaje (SignalR)
```javascript
// Conectar al hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5086/chatHub?access_token=" + token)
    .build();

// Validar comunicación primero
await connection.invoke("ValidateCommunication", {
    otherUserID: 2,
    solicitudID: 1
});

// Escuchar resultado de validación
connection.on("CommunicationValidated", (validation) => {
    if (validation.canCommunicate) {
        // Enviar mensaje
        connection.invoke("SendMessage", {
            receiverID: 2,
            content: "Hola desde SignalR!",
            messageType: "Text",
            solicitudID: 1
        });
    } else {
        console.log("No se puede comunicar:", validation.message);
    }
});

// Escuchar mensajes nuevos
connection.on("ReceiveMessage", (message) => {
    console.log("Nuevo mensaje:", message);
});
```

### Obtener Conversaciones Activas
```http
GET /api/chat/active-conversations
Authorization: Bearer <token>
Accept: application/json
```

## 🔧 Configuración

### Variables de Entorno
- `ASPNETCORE_ENVIRONMENT`: Entorno de ejecución (Development/Docker)
- `ConnectionStrings__Default`: Cadena de conexión a la base de datos
- `Jwt__Key`: Clave secreta para JWT
- `Jwt__Issuer`: Emisor del token JWT
- `Jwt__Audience`: Audiencia del token JWT
- `Services__RequestServiceUrl`: URL del Request Service

### Puertos
- **Desarrollo:** 5086 (HTTP), 7054 (HTTPS)
- **Docker:** 8080

## 🧪 Testing

### 🚀 **Flujo Completo con Swagger (Recomendado)**

#### **Paso 1: Verificar Servicios**
```bash
# Verificar que todos los servicios estén corriendo
curl http://localhost:5070/api/chat/test
curl http://localhost:5050/api/solicitud/test
curl http://localhost:5001/api/auth/test
```

#### **Paso 2: Obtener Token JWT**
1. **Abrir:** `http://localhost:5001/swagger`
2. **Buscar:** `POST /api/auth/login`
3. **Ejecutar con:**
```json
{
  "email": "cliente@test.com",
  "password": "Cliente123!"
}
```
4. **Copiar el token** del response

#### **Paso 3: Crear Solicitud Válida**
1. **Abrir:** `http://localhost:5050/swagger`
2. **Buscar:** `POST /api/solicitudcliente`
3. **Ejecutar con:**
```json
{
  "clienteID": 1,
  "cuidadorID": 2,
  "fechaServicio": "2024-01-20T10:00:00",
  "duracionHoras": 2,
  "descripcion": "Cuidado de mi perro"
}
```
4. **Anotar el `solicitudID`** del response

#### **Paso 4: Asignar Cuidador**
1. **Buscar:** `PUT /api/solicitudcliente/{id}/asignar-cuidador`
2. **Ejecutar con el `solicitudID`** obtenido
3. **Esto cambia el estado a "Asignada"** ✅

#### **Paso 5: Probar Chat**
1. **Abrir:** `http://localhost:5070/swagger`
2. **Hacer clic en "Authorize"** (🔒 arriba a la derecha)
3. **Pegar el token JWT** (Bearer TU_TOKEN)
4. **Probar endpoints:**

**a) Validar comunicación:**
- `POST /api/chat/validate-communication`
```json
{
  "clienteID": 1,
  "cuidadorID": 2,
  "solicitudID": 123
}
```

**b) Enviar mensaje:**
- `POST /api/chat/send-message`
```json
{
  "senderID": 1,
  "receiverID": 2,
  "solicitudID": 123,
  "content": "¡Hola! ¿Ya llegaste a mi casa?"
}
```

**c) Obtener conversación:**
- `GET /api/chat/conversation/{senderID}/{receiverID}/{solicitudID}`

### Ejecutar Tests
```bash
dotnet test
```

### Probar Endpoints
Utiliza el archivo `PetCare.Chat.http` para probar los endpoints con REST Client.

### Swagger UI
Accede a la documentación interactiva en: `http://localhost:5086/swagger`

### Probar SignalR
```javascript
// Ejemplo de cliente JavaScript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5086/chatHub?access_token=YOUR_JWT_TOKEN")
    .build();

connection.start().then(() => {
    console.log("Conectado al hub de chat");
    
    // Obtener conversaciones activas
    connection.invoke("GetActiveConversations");
});

connection.on("ActiveConversations", (conversations) => {
    console.log("Conversaciones activas:", conversations);
});

connection.on("ReceiveMessage", (message) => {
    console.log("Mensaje recibido:", message);
});
```

## 🐳 Docker

### Construir Imagen
```bash
docker build -t petcare-chat .
```

### Ejecutar Contenedor
```bash
docker run -d \
  --name petcare-chat \
  -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Docker \
  petcare-chat
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
- 💬 Mensajes de chat
- 🔗 Conexiones SignalR
- ✅ Validaciones de comunicación
- ⚠️ Advertencias
- ❌ Errores

### Métricas
- **Usuarios conectados** en tiempo real
- **Mensajes enviados** por minuto
- **Tiempo de respuesta** de la API
- **Estado de la base de datos**
- **Validaciones de comunicación** exitosas/fallidas

## 🔄 Flujo de Comunicación

### 1. Conexión al Hub
1. **Cliente se conecta** al SignalR Hub con token JWT
2. **Servidor valida** el token y registra la conexión
3. **Usuario se une** a su grupo personal

### 2. Validación de Comunicación
1. **Cliente solicita** validar comunicación con otro usuario
2. **Servidor consulta** Request Service para verificar solicitudes activas
3. **Servidor valida** estado de solicitud y permisos
4. **Servidor responde** con resultado de validación

### 3. Envío de Mensaje
1. **Cliente envía** mensaje vía SignalR o REST API
2. **Servidor valida** comunicación automáticamente
3. **Servidor guarda** mensaje en BD si validación es exitosa
4. **Servidor envía** mensaje al destinatario si está conectado
5. **Servidor confirma** envío al remitente

### 4. Recepción de Mensaje
1. **Destinatario recibe** mensaje en tiempo real
2. **Cliente actualiza** interfaz de usuario
3. **Cliente marca** mensaje como leído (opcional)

### 5. Estado de Lectura
1. **Cliente marca** mensajes como leídos
2. **Servidor actualiza** BD
3. **Servidor notifica** al remitente

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de Validación de Comunicación
```bash
# Verificar Request Service
curl http://localhost:5050/api/solicitud/test

# Verificar logs de validación
docker-compose logs petcare-chat | grep "Validación"
```

#### 2. Error de Conexión SignalR
```bash
# Verificar que el hub esté disponible
curl http://localhost:5086/chatHub

# Verificar logs
docker-compose logs petcare-chat
```

#### 3. Error de Autenticación
```bash
# Verificar token JWT
curl -H "Authorization: Bearer <token>" http://localhost:5086/api/chat/test

# Verificar configuración JWT
docker-compose logs petcare-chat | grep JWT
```

#### 4. Error de Base de Datos
```bash
# Verificar SQL Server
docker-compose logs db-chat

# Probar conexión
sqlcmd -S localhost,14420 -U sa -P YourStrong@Passw0rd -Q "SELECT 1"
```

## 📝 Roadmap

| Funcionalidad | Estado | Prioridad |
|---------------|--------|-----------|
| **Estructura del Proyecto** | ✅ | Alta |
| **Base de Datos** | ✅ | Alta |
| **Docker & Docker Compose** | ✅ | Alta |
| **Migraciones Automáticas** | ✅ | Alta |
| **Autenticación JWT** | ✅ | Alta |
| **SignalR Hub** | ✅ | Alta |
| **API REST** | ✅ | Alta |
| **Swagger con Bearer** | ✅ | Alta |
| **Mensajería en Tiempo Real** | ✅ | Alta |
| **Estado de Lectura** | ✅ | Alta |
| **Validación de Comunicación** | ✅ | Alta |
| **Comunicación Inter-servicios** | ✅ | Alta |
| **Archivos Adjuntos** | ❌ | Media |
| **Notificaciones Push** | ❌ | Media |
| **Grupos de Chat** | ❌ | Baja |
| **Encriptación E2E** | ❌ | Baja |
| **Tests Unitarios** | ❌ | Media |
| **CI/CD Pipeline** | ❌ | Baja |

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](../LICENSE) para detalles.

---

**¡Gracias por usar PetCare Chat Service! 💬** 