using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using PetCareServicios.Models.Chat;
using PetCareServicios.Services.Interfaces;

namespace PetCareServicios.Controllers
{
    /// <summary>
    /// Controlador para gestionar operaciones de chat
    /// Maneja mensajes, conversaciones y estado de lectura
    /// Requiere autenticación JWT para todas las operaciones
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        /// <summary>
        /// Enviar un mensaje a otro usuario
        /// </summary>
        [HttpPost("send")]
        public async Task<ActionResult<ChatMessageResponse>> SendMessage([FromBody] ChatMessageRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var currentUserId = GetCurrentUserId();
                var jwtToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var message = await _chatService.SendMessageAsync(currentUserId, request, jwtToken);
                return Ok(message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener conversación entre cliente y cuidador para una solicitud
        /// </summary>
        [HttpGet("conversation/{clienteId}/{cuidadorId}/{solicitudId}")]
        public async Task<ActionResult<List<ChatMessageResponse>>> GetConversation(int clienteId, int cuidadorId, int solicitudId)
        {
            try
            {
                var messages = await _chatService.GetConversationAsync(clienteId, cuidadorId, solicitudId);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener todas las conversaciones del usuario
        /// </summary>
        [HttpGet("conversations")]
        public async Task<ActionResult<List<ConversationResponse>>> GetConversations()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var jwtToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var conversations = await _chatService.GetUserConversationsAsync(currentUserId, jwtToken);
                return Ok(conversations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Validar si se puede comunicar con otro usuario
        /// </summary>
        [HttpPost("validate-communication")]
        public async Task<ActionResult<CommunicationValidationResponse>> ValidateCommunication([FromBody] CommunicationValidationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = GetCurrentUserId();
                var jwtToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var validation = await _chatService.ValidateCommunicationBySolicitudAsync(userId, request.SolicitudID, jwtToken);
                return Ok(validation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Validar comunicación por ID de solicitud específico
        /// </summary>
        [HttpGet("validate-solicitud/{solicitudId}")]
        public async Task<ActionResult<CommunicationValidationResponse>> ValidateCommunicationBySolicitud(int solicitudId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var jwtToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var validation = await _chatService.ValidateCommunicationBySolicitudAsync(currentUserId, solicitudId, jwtToken);
                return Ok(validation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener conversaciones activas del usuario
        /// </summary>
        [HttpGet("active-conversations")]
        public async Task<ActionResult<List<CommunicationValidationResponse>>> GetActiveConversations()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var jwtToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var activeConversations = await _chatService.GetActiveConversationsAsync(currentUserId, jwtToken);
                return Ok(activeConversations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Marcar mensajes como leídos
        /// </summary>
        [HttpPost("mark-read")]
        public async Task<ActionResult> MarkAsRead([FromBody] MarkAsReadRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var currentUserId = GetCurrentUserId();
                var success = await _chatService.MarkMessagesAsReadAsync(currentUserId, request.SenderID);
                
                if (success)
                {
                    return Ok(new { message = "Mensajes marcados como leídos" });
                }
                
                return BadRequest(new { message = "No se pudieron marcar los mensajes como leídos" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener cantidad de mensajes no leídos
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var count = await _chatService.GetUnreadMessageCountAsync(currentUserId);
                return Ok(count);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener mensajes recientes del usuario
        /// </summary>
        [HttpGet("recent")]
        public async Task<ActionResult<List<ChatMessageResponse>>> GetRecentMessages([FromQuery] int limit = 50)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var messages = await _chatService.GetRecentMessagesAsync(currentUserId, limit);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Eliminar un mensaje (solo el remitente puede eliminar sus mensajes)
        /// </summary>
        [HttpDelete("message/{messageId}")]
        public async Task<ActionResult> DeleteMessage(int messageId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var success = await _chatService.DeleteMessageAsync(messageId, currentUserId);
                
                if (success)
                {
                    return Ok(new { message = "Mensaje eliminado correctamente" });
                }
                
                return NotFound(new { message = "Mensaje no encontrado o no tienes permisos para eliminarlo" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener estados de solicitud que permiten comunicación
        /// </summary>
        [HttpGet("estados-comunicacion")]
        [AllowAnonymous]
        public ActionResult<object> GetEstadosComunicacion()
        {
            return Ok(new
            {
                estadosPermitidos = SolicitudEstadosComunicacion.EstadosPermitidos,
                estadosNoPermitidos = SolicitudEstadosComunicacion.EstadosNoPermitidos,
                descripcion = "Estados que permiten comunicación entre cliente y cuidador"
            });
        }

        /// <summary>
        /// Endpoint de prueba para verificar que el controlador funciona
        /// </summary>
        [HttpGet("test")]
        [AllowAnonymous]
        public ActionResult<object> Test()
        {
            return Ok(new { 
                message = "ChatController funcionando correctamente", 
                timestamp = DateTime.UtcNow,
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
            });
        }

        /// <summary>
        /// Obtener el ID del usuario actual desde el token JWT
        /// </summary>
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Usuario no autenticado o ID inválido");
            }
            return userId;
        }
    }
} 