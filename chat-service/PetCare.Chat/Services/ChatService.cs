using Microsoft.EntityFrameworkCore;
using PetCareServicios.Data;
using PetCareServicios.Models.Chat;
using PetCareServicios.Services.Interfaces;
using AutoMapper;
using System.Text.Json;
using System.Net.Http.Headers;

namespace PetCareServicios.Services
{
    public class ChatService : IChatService
    {
        private readonly ChatDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public ChatService(ChatDbContext context, IMapper mapper, IConfiguration configuration, HttpClient httpClient)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _httpClient = httpClient;
        }

        public async Task<ChatMessageResponse> SendMessageAsync(int senderId, ChatMessageRequest request, string jwtToken)
        {
            Console.WriteLine($"[DEBUG] SendMessageAsync: senderId={senderId}, receiverID={request.ReceiverID}, solicitudID={request.SolicitudID}");
            // Validar si los usuarios pueden comunicarse
            var validation = await ValidateCommunicationAsync(senderId, request.ReceiverID, request.SolicitudID.Value, jwtToken);
            Console.WriteLine($"[DEBUG] Resultado de validación: {System.Text.Json.JsonSerializer.Serialize(validation)}");
            if (!validation.CanCommunicate)
            {
                Console.WriteLine($"[DEBUG] Comunicación NO permitida: {validation.Message}");
                throw new InvalidOperationException(validation.Message);
            }

            var message = new ChatMessage
            {
                SenderID = senderId,
                ReceiverID = request.ReceiverID,
                Content = request.Content,
                MessageType = request.MessageType,
                AttachmentUrl = request.AttachmentUrl,
                AttachmentName = request.AttachmentName,
                Timestamp = DateTime.UtcNow,
                SolicitudID = validation.SolicitudID,
                SolicitudEstado = validation.SolicitudEstado
            };

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            return _mapper.Map<ChatMessageResponse>(message);
        }

        public async Task<List<ChatMessageResponse>> GetConversationAsync(int clienteId, int cuidadorId, int solicitudId)
        {
            // Buscar mensajes entre cliente y cuidador para la solicitud específica
            var messages = await _context.ChatMessages
                .Where(m => ((m.SenderID == clienteId && m.ReceiverID == cuidadorId) || (m.SenderID == cuidadorId && m.ReceiverID == clienteId))
                            && m.SolicitudID == solicitudId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
            return _mapper.Map<List<ChatMessageResponse>>(messages);
        }

        public async Task<List<ConversationResponse>> GetUserConversationsAsync(int userId, string jwtToken)
        {
            // Obtener todas las conversaciones del usuario
            var conversations = await _context.ChatMessages
                .Where(m => m.SenderID == userId || m.ReceiverID == userId)
                .GroupBy(m => m.SenderID == userId ? m.ReceiverID : m.SenderID)
                .Select(g => new
                {
                    OtherUserId = g.Key,
                    LastMessage = g.OrderByDescending(m => m.Timestamp).First(),
                    UnreadCount = g.Count(m => m.ReceiverID == userId && !m.IsRead)
                })
                .ToListAsync();

            var result = new List<ConversationResponse>();

            foreach (var conv in conversations)
            {
                // Validar si la conversación sigue activa
                var validation = await ValidateCommunicationAsync(userId, conv.OtherUserId, conv.LastMessage.SolicitudID.Value, jwtToken);
                
                var conversation = new ConversationResponse
                {
                    OtherUserID = conv.OtherUserId,
                    OtherUserName = conv.LastMessage.SenderID == userId 
                        ? conv.LastMessage.ReceiverName 
                        : conv.LastMessage.SenderName,
                    UnreadCount = conv.UnreadCount,
                    LastMessageTime = conv.LastMessage.Timestamp,
                    SolicitudID = validation.SolicitudID,
                    SolicitudEstado = validation.SolicitudEstado
                };

                // Solo incluir conversaciones activas
                if (validation.CanCommunicate)
                {
                    // Obtener los últimos 20 mensajes de esta conversación
                    var recentMessages = await GetConversationAsync(userId, conv.OtherUserId, validation.SolicitudID.Value);
                    conversation.Messages = recentMessages.TakeLast(20).ToList();
                    result.Add(conversation);
                }
            }

            return result.OrderByDescending(c => c.LastMessageTime).ToList();
        }

        public async Task<bool> MarkMessagesAsReadAsync(int userId, int senderId)
        {
            var unreadMessages = await _context.ChatMessages
                .Where(m => m.SenderID == senderId && m.ReceiverID == userId && !m.IsRead)
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadMessageCountAsync(int userId)
        {
            return await _context.ChatMessages
                .CountAsync(m => m.ReceiverID == userId && !m.IsRead);
        }

        public async Task<List<ChatMessageResponse>> GetRecentMessagesAsync(int userId, int limit = 50)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.SenderID == userId || m.ReceiverID == userId)
                .OrderByDescending(m => m.Timestamp)
                .Take(limit)
                .ToListAsync();

            return _mapper.Map<List<ChatMessageResponse>>(messages);
        }

        public async Task<bool> DeleteMessageAsync(int messageId, int userId)
        {
            var message = await _context.ChatMessages
                .FirstOrDefaultAsync(m => m.MessageID == messageId && m.SenderID == userId);

            if (message == null)
                return false;

            _context.ChatMessages.Remove(message);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CommunicationValidationResponse> ValidateCommunicationAsync(int clienteId, int cuidadorId, int solicitudId, string jwtToken)
        {
            try
            {
                // Si se proporciona un solicitudId específico, validar esa solicitud
                if (solicitudId != 0) // Assuming 0 means no specific solicitudId
                {
                    return await ValidateCommunicationBySolicitudAsync(clienteId, solicitudId, jwtToken);
                }

                // Buscar solicitudes activas entre los dos usuarios
                var requestServiceUrl = _configuration["Services:RequestServiceUrl"] ?? "http://localhost:5010";
                
                // Buscar solicitudes donde ambos usuarios participan
                var request = new HttpRequestMessage(HttpMethod.Get, $"{requestServiceUrl}/api/solicitud/cliente/{clienteId}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);
                var response = await _httpClient.SendAsync(request);
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var solicitudes = JsonSerializer.Deserialize<List<dynamic>>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (solicitudes != null)
                    {
                        foreach (var solicitud in solicitudes)
                        {
                            var cuidadorIdValue = solicitud.GetProperty("cuidadorID").GetInt32();
                            var estado = solicitud.GetProperty("estado").GetString();
                            var solicitudIdValue = solicitud.GetProperty("solicitudID").GetInt32();

                            // Verificar si la solicitud involucra al otro usuario y permite comunicación
                            if (cuidadorIdValue == cuidadorId && SolicitudEstadosComunicacion.PermiteComunicacion(estado))
                            {
                                return new CommunicationValidationResponse
                                {
                                    CanCommunicate = true,
                                    Message = "Comunicación permitida",
                                    SolicitudID = solicitudIdValue,
                                    SolicitudEstado = estado,
                                    SolicitudTipoServicio = solicitud.GetProperty("tipoServicio").GetString(),
                                    SolicitudFechaHoraInicio = DateTime.Parse(solicitud.GetProperty("fechaHoraInicio").GetString())
                                };
                            }
                        }
                    }
                }

                return new CommunicationValidationResponse
                {
                    CanCommunicate = false,
                    Message = "No hay solicitudes activas que permitan comunicación entre estos usuarios"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error validando comunicación: {ex.Message}");
                return new CommunicationValidationResponse
                {
                    CanCommunicate = false,
                    Message = "Error al validar comunicación"
                };
            }
        }

        public async Task<CommunicationValidationResponse> ValidateCommunicationBySolicitudAsync(int userId, int solicitudId, string jwtToken)
        {
            try
            {
                var requestServiceUrl = _configuration["Services:RequestServiceUrl"] ?? "http://localhost:5010";
                var tokenPreview = string.IsNullOrEmpty(jwtToken)
                    ? "null"
                    : (jwtToken.Length > 20 ? jwtToken.Substring(0, 20) + "..." : jwtToken);
                Console.WriteLine($"[DEBUG] Validando comunicación por solicitud: userId={userId}, solicitudId={solicitudId}, token={tokenPreview}");
                var request = new HttpRequestMessage(HttpMethod.Get, $"{requestServiceUrl}/api/solicitud/{solicitudId}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);
                var response = await _httpClient.SendAsync(request);
                Console.WriteLine($"[DEBUG] Código de respuesta del Request Service: {response.StatusCode}");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"[DEBUG] Respuesta solicitud: {content}");
                    var solicitud = JsonSerializer.Deserialize<dynamic>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (solicitud is JsonElement solicitudElem && solicitudElem.ValueKind == JsonValueKind.Object)
                    {
                        var clienteId = solicitudElem.GetProperty("clienteID").GetInt32();
                        var cuidadorId = solicitudElem.GetProperty("cuidadorID").GetInt32();
                        var estado = solicitudElem.GetProperty("estado").GetString();
                        Console.WriteLine($"[DEBUG] clienteId: {clienteId}, cuidadorId: {cuidadorId}, userId: {userId}, estado: {estado}");
                        if (clienteId != userId && cuidadorId != userId)
                        {
                            Console.WriteLine($"[DEBUG] El usuario no es parte de la solicitud");
                            return new CommunicationValidationResponse
                            {
                                CanCommunicate = false,
                                Message = "No tienes permisos para comunicarte en esta solicitud"
                            };
                        }
                        if (SolicitudEstadosComunicacion.PermiteComunicacion(estado))
                        {
                            Console.WriteLine($"[DEBUG] Comunicación permitida por estado: {estado}");
                            return new CommunicationValidationResponse
                            {
                                CanCommunicate = true,
                                Message = "Comunicación permitida",
                                SolicitudID = solicitudId,
                                SolicitudEstado = estado,
                                SolicitudTipoServicio = solicitudElem.GetProperty("tipoServicio").GetString(),
                                SolicitudFechaHoraInicio = DateTime.Parse(solicitudElem.GetProperty("fechaHoraInicio").GetString())
                            };
                        }
                        else
                        {
                            Console.WriteLine($"[DEBUG] Estado no permite comunicación: {estado}");
                            return new CommunicationValidationResponse
                            {
                                CanCommunicate = false,
                                Message = $"La solicitud está en estado '{estado}' y no permite comunicación",
                                SolicitudID = solicitudId,
                                SolicitudEstado = estado
                            };
                        }
                    }
                    else
                    {
                        Console.WriteLine("[DEBUG] El objeto solicitud no es un JsonElement válido.");
                        return new CommunicationValidationResponse
                        {
                            CanCommunicate = false,
                            Message = "Error al procesar la solicitud"
                        };
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"[DEBUG] Error al obtener solicitud: {errorContent}");
                }

                return new CommunicationValidationResponse
                {
                    CanCommunicate = false,
                    Message = "Solicitud no encontrada"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error validando comunicación por solicitud: {ex.Message}");
                return new CommunicationValidationResponse
                {
                    CanCommunicate = false,
                    Message = "Error al validar comunicación"
                };
            }
        }

        public async Task<List<CommunicationValidationResponse>> GetActiveConversationsAsync(int userId, string jwtToken)
        {
            var result = new List<CommunicationValidationResponse>();
            
            try
            {
                var requestServiceUrl = _configuration["Services:RequestServiceUrl"] ?? "http://localhost:5010";
                var response = await _httpClient.GetAsync($"{requestServiceUrl}/api/solicitud/cliente/{userId}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var solicitudes = JsonSerializer.Deserialize<List<dynamic>>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (solicitudes != null)
                    {
                        foreach (var solicitud in solicitudes)
                        {
                            var estado = solicitud.GetProperty("estado").GetString();
                            
                            if (SolicitudEstadosComunicacion.PermiteComunicacion(estado))
                            {
                                var cuidadorId = solicitud.GetProperty("cuidadorID").GetInt32();
                                var solicitudId = solicitud.GetProperty("solicitudID").GetInt32();
                                
                                result.Add(new CommunicationValidationResponse
                                {
                                    CanCommunicate = true,
                                    Message = "Conversación activa",
                                    SolicitudID = solicitudId,
                                    SolicitudEstado = estado,
                                    SolicitudTipoServicio = solicitud.GetProperty("tipoServicio").GetString(),
                                    SolicitudFechaHoraInicio = DateTime.Parse(solicitud.GetProperty("fechaHoraInicio").GetString())
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error obteniendo conversaciones activas: {ex.Message}");
            }

            return result;
        }
    }
} 