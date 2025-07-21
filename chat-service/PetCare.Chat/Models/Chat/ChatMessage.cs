using System.ComponentModel.DataAnnotations;

namespace PetCareServicios.Models.Chat
{
    /// <summary>
    /// Modelo para los mensajes de chat
    /// </summary>
    public class ChatMessage
    {
        public int MessageID { get; set; }
        
        [Required]
        public int SenderID { get; set; }
        
        [Required]
        public int ReceiverID { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;
        
        public string MessageType { get; set; } = "Text"; // Text, Image, File
        
        public bool IsRead { get; set; } = false;
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        public string? AttachmentUrl { get; set; }
        
        public string? AttachmentName { get; set; }
        
        // Propiedades de navegación (para mostrar información del usuario)
        public string SenderName { get; set; } = string.Empty;
        public string ReceiverName { get; set; } = string.Empty;
        
        // Propiedades para validación de solicitud
        public int? SolicitudID { get; set; }
        public string? SolicitudEstado { get; set; }
    }

    /// <summary>
    /// DTO para crear un nuevo mensaje
    /// </summary>
    public class ChatMessageRequest
    {
        [Required]
        public int ReceiverID { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;
        
        public string MessageType { get; set; } = "Text";
        
        public string? AttachmentUrl { get; set; }
        
        public string? AttachmentName { get; set; }
        
        // ID de la solicitud para validar comunicación
        public int? SolicitudID { get; set; }
    }

    /// <summary>
    /// DTO para respuesta de mensaje
    /// </summary>
    public class ChatMessageResponse
    {
        public int MessageID { get; set; }
        public int SenderID { get; set; }
        public int ReceiverID { get; set; }
        public string Content { get; set; } = string.Empty;
        public string MessageType { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime Timestamp { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? AttachmentName { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string ReceiverName { get; set; } = string.Empty;
        public int? SolicitudID { get; set; }
        public string? SolicitudEstado { get; set; }
    }

    /// <summary>
    /// DTO para marcar mensajes como leídos
    /// </summary>
    public class MarkAsReadRequest
    {
        [Required]
        public int SenderID { get; set; }
    }

    /// <summary>
    /// DTO para conversación entre dos usuarios
    /// </summary>
    public class ConversationResponse
    {
        public int OtherUserID { get; set; }
        public string OtherUserName { get; set; } = string.Empty;
        public List<ChatMessageResponse> Messages { get; set; } = new();
        public int UnreadCount { get; set; }
        public DateTime LastMessageTime { get; set; }
        public int? SolicitudID { get; set; }
        public string? SolicitudEstado { get; set; }
    }

    /// <summary>
    /// DTO para validar si dos usuarios pueden comunicarse
    /// </summary>
    public class CommunicationValidationRequest
    {
        [Required]
        public int SolicitudID { get; set; }
    }

    /// <summary>
    /// DTO para respuesta de validación de comunicación
    /// </summary>
    public class CommunicationValidationResponse
    {
        public bool CanCommunicate { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? SolicitudID { get; set; }
        public string? SolicitudEstado { get; set; }
        public string? SolicitudTipoServicio { get; set; }
        public DateTime? SolicitudFechaHoraInicio { get; set; }
    }

    /// <summary>
    /// Estados de solicitud que permiten comunicación
    /// </summary>
    public static class SolicitudEstadosComunicacion
    {
        public static readonly string[] EstadosPermitidos = 
        {
            "Asignada",    // Cliente asignó cuidador
            "Aceptada",    // Cuidador aceptó la solicitud
            "En Progreso"  // Servicio en ejecución
        };

        public static readonly string[] EstadosNoPermitidos = 
        {
            "Pendiente",   // No asignada
            "Rechazada",   // Cuidador rechazó
            "Finalizada",  // Servicio completado
            "Cancelada"    // Cliente canceló
        };

        public static bool PermiteComunicacion(string estado)
        {
            return EstadosPermitidos.Contains(estado, StringComparer.OrdinalIgnoreCase);
        }
    }
} 