using PetCareServicios.Models.Chat;

namespace PetCareServicios.Services.Interfaces
{
    public interface IChatService
    {
        Task<ChatMessageResponse> SendMessageAsync(int senderId, ChatMessageRequest request, string jwtToken);
        Task<List<ChatMessageResponse>> GetConversationAsync(int clienteId, int cuidadorId, int solicitudId);
        Task<List<ConversationResponse>> GetUserConversationsAsync(int userId, string jwtToken);
        Task<bool> MarkMessagesAsReadAsync(int userId, int senderId);
        Task<int> GetUnreadMessageCountAsync(int userId);
        Task<List<ChatMessageResponse>> GetRecentMessagesAsync(int userId, int limit = 50);
        Task<bool> DeleteMessageAsync(int messageId, int userId);
        Task DeleteMessagesByIdChatAsync(string idChat);
        
        // Nuevos métodos para validación de comunicación
        Task<CommunicationValidationResponse> ValidateCommunicationAsync(int clienteId, int cuidadorId, int solicitudId, string jwtToken);
        Task<CommunicationValidationResponse> ValidateCommunicationBySolicitudAsync(int userId, int solicitudId, string jwtToken);
        Task<List<CommunicationValidationResponse>> GetActiveConversationsAsync(int userId, string jwtToken);
    }
} 