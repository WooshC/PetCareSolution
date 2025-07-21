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

> **Nota:** En SignalR, el token debe ir en la query string como `access_token`. El backend extrae el token automáticamente para validar la comunicación y los mensajes. Si el token no se envía correctamente, la validación fallará y verás mensajes de depuración en consola indicando `token=null`.

## 📝 Ejemplos de Uso

### Validar Comunicación
```http
POST /api/chat/validate-communication
Authorization: Bearer <token>
Content-Type: application/json

{
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
    .withUrl("http://localhost:5070/chatHub?access_token=" + token)
    .build();

// Validar comunicación primero
await connection.invoke("ValidateCommunication", {
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

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de Validación de Comunicación o Token nulo en SignalR
- **Síntoma:** En los logs aparece `[DEBUG] Validando comunicación por solicitud: userId=..., solicitudId=..., token=null` y la validación falla.
- **Causa:** El token JWT no se está enviando correctamente en la query string como `access_token`.
- **Solución:**
  - Asegúrate de conectar a SignalR así:
    ```js
    .withUrl("http://localhost:5070/chatHub?access_token=" + token)
    ```
  - Si usas un cliente personalizado, revisa que el token se pase por query string.
  - El backend ya extrae el token del header o de la query string automáticamente.

#### 2. Error 401 Unauthorized al validar comunicación
- **Síntoma:** El Request Service responde 401 y la validación falla.
- **Causa:** El token JWT no es válido, está expirado o no corresponde al usuario de la solicitud.
- **Solución:**
  - Verifica que el token sea correcto y vigente.
  - El usuario autenticado debe ser parte de la solicitud (cliente o cuidador).

#### 3. Comunicación no permitida por estado de solicitud
- **Síntoma:** Mensaje: `La solicitud está en estado 'Finalizada' y no permite comunicación`.
- **Solución:**
  - Solo los estados `Asignada`, `Aceptada` y `En Progreso` permiten chat.

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