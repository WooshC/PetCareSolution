using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using PetCareServicios.Models.Chat;
using PetCareServicios.Services.Interfaces;

namespace PetCareServicios.Hubs
{
    /// <summary>
    /// Hub de SignalR para comunicación en tiempo real del chat
    /// </summary>
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private static readonly Dictionary<int, string> _userConnections = new();

        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }

        /// <summary>
        /// Cuando un usuario se conecta al hub
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                _userConnections[userId.Value] = Context.ConnectionId;
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
                
                Console.WriteLine($"🔗 Usuario {userId} conectado al chat. ConnectionId: {Context.ConnectionId}");
            }

            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Cuando un usuario se desconecta del hub
        /// </summary>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                _userConnections.Remove(userId.Value);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userId}");
                
                Console.WriteLine($"🔌 Usuario {userId} desconectado del chat. ConnectionId: {Context.ConnectionId}");
            }

            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Enviar mensaje a un usuario específico
        /// </summary>
        public async Task SendMessage(ChatMessageRequest message)
        {
            var senderId = GetCurrentUserId();
            if (!senderId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "Usuario no autenticado");
                return;
            }

            try
            {
                var jwtToken = Context.GetHttpContext().Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                // Validar si los usuarios pueden comunicarse
                var validation = await _chatService.ValidateCommunicationAsync(senderId.Value, message.ReceiverID, message.SolicitudID.Value, jwtToken);
                if (!validation.CanCommunicate)
                {
                    await Clients.Caller.SendAsync("Error", validation.Message);
                    return;
                }

                // Guardar el mensaje en la base de datos
                var savedMessage = await _chatService.SendMessageAsync(senderId.Value, message);
                
                // Enviar el mensaje al destinatario si está conectado
                if (_userConnections.TryGetValue(message.ReceiverID, out var receiverConnectionId))
                {
                    await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", savedMessage);
                }

                // Confirmar al remitente que el mensaje se envió
                await Clients.Caller.SendAsync("MessageSent", savedMessage);
                
                Console.WriteLine($"💬 Mensaje enviado de {senderId} a {message.ReceiverID}: {message.Content}");
                Console.WriteLine($"📋 Solicitud ID: {validation.SolicitudID}, Estado: {validation.SolicitudEstado}");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"❌ Error de validación: {ex.Message}");
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error enviando mensaje: {ex.Message}");
                await Clients.Caller.SendAsync("Error", "Error al enviar el mensaje");
            }
        }

        /// <summary>
        /// Validar comunicación antes de enviar mensaje
        /// </summary>
        public async Task ValidateCommunication(CommunicationValidationRequest request)
        {
            var currentUserId = GetCurrentUserId();
            if (!currentUserId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "Usuario no autenticado");
                return;
            }

            try
            {
                var jwtToken = Context.GetHttpContext().Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var validation = await _chatService.ValidateCommunicationAsync(request.ClienteID, request.CuidadorID, request.SolicitudID, jwtToken);
                await Clients.Caller.SendAsync("CommunicationValidated", validation);
                
                Console.WriteLine($"✅ Validación de comunicación: {validation.CanCommunicate} - {validation.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error validando comunicación: {ex.Message}");
                await Clients.Caller.SendAsync("Error", "Error al validar comunicación");
            }
        }

        /// <summary>
        /// Obtener conversaciones activas
        /// </summary>
        public async Task GetActiveConversations()
        {
            var currentUserId = GetCurrentUserId();
            if (!currentUserId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "Usuario no autenticado");
                return;
            }

            try
            {
                var jwtToken = Context.GetHttpContext().Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var conversations = await _chatService.GetActiveConversationsAsync(currentUserId.Value, jwtToken);
                await Clients.Caller.SendAsync("ActiveConversations", conversations);
                
                Console.WriteLine($"📋 Usuario {currentUserId} tiene {conversations.Count} conversaciones activas");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error obteniendo conversaciones activas: {ex.Message}");
                await Clients.Caller.SendAsync("Error", "Error al obtener conversaciones activas");
            }
        }

        /// <summary>
        /// Marcar mensajes como leídos
        /// </summary>
        public async Task MarkAsRead(int senderId)
        {
            var currentUserId = GetCurrentUserId();
            if (!currentUserId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "Usuario no autenticado");
                return;
            }

            try
            {
                await _chatService.MarkMessagesAsReadAsync(currentUserId.Value, senderId);
                
                // Notificar al remitente que sus mensajes fueron leídos
                if (_userConnections.TryGetValue(senderId, out var senderConnectionId))
                {
                    await Clients.Client(senderConnectionId).SendAsync("MessagesRead", currentUserId.Value);
                }
                
                Console.WriteLine($"✅ Mensajes marcados como leídos por {currentUserId} de {senderId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error marcando mensajes como leídos: {ex.Message}");
                await Clients.Caller.SendAsync("Error", "Error al marcar mensajes como leídos");
            }
        }

        /// <summary>
        /// Unirse a una conversación específica
        /// </summary>
        public async Task JoinConversation(int clienteId, int cuidadorId, int solicitudId)
        {
            var currentUserId = GetCurrentUserId();
            var jwtToken = Context.GetHttpContext().Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var validation = await _chatService.ValidateCommunicationAsync(clienteId, cuidadorId, solicitudId, jwtToken);
            if (!validation.CanCommunicate)
            {
                await Clients.Caller.SendAsync("CommunicationNotAllowed", validation.Message);
                return;
            }
            var groupName = GetConversationGroupName(clienteId, cuidadorId, solicitudId);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine($"👥 Usuario {currentUserId} se unió a la conversación Cliente:{clienteId} Cuidador:{cuidadorId} Solicitud:{solicitudId}");
        }

        /// <summary>
        /// Salir de una conversación específica
        /// </summary>
        public async Task LeaveConversation(int clienteId, int cuidadorId, int solicitudId)
        {
            var groupName = GetConversationGroupName(clienteId, cuidadorId, solicitudId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine($"👋 Usuario salió de la conversación Cliente:{clienteId} Cuidador:{cuidadorId} Solicitud:{solicitudId}");
        }

        /// <summary>
        /// Obtener el ID del usuario actual desde el token JWT
        /// </summary>
        private int? GetCurrentUserId()
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            return null;
        }

        /// <summary>
        /// Generar nombre de grupo para una conversación entre dos usuarios
        /// </summary>
        private static string GetConversationGroupName(int user1Id, int user2Id)
        {
            var orderedIds = new[] { user1Id, user2Id }.OrderBy(id => id);
            return $"Conversation_{orderedIds.First()}_{orderedIds.Last()}";
        }

        /// <summary>
        /// Generar nombre de grupo para una conversación entre dos usuarios
        /// </summary>
        private static string GetConversationGroupName(int clienteId, int cuidadorId, int solicitudId)
        {
            var orderedIds = new[] { clienteId, cuidadorId }.OrderBy(id => id);
            return $"Conversation_{orderedIds.First()}_{orderedIds.Last()}_Solicitud_{solicitudId}";
        }

        /// <summary>
        /// Obtener el connection ID de un usuario
        /// </summary>
        public static string? GetUserConnectionId(int userId)
        {
            return _userConnections.TryGetValue(userId, out var connectionId) ? connectionId : null;
        }

        /// <summary>
        /// Verificar si un usuario está conectado
        /// </summary>
        public static bool IsUserConnected(int userId)
        {
            return _userConnections.ContainsKey(userId);
        }
    }
} 