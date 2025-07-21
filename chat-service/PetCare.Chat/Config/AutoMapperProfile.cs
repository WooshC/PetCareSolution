using AutoMapper;
using PetCareServicios.Models.Chat;

namespace PetCareServicios.Config
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Mapeo de ChatMessage a ChatMessageResponse
            CreateMap<ChatMessage, ChatMessageResponse>()
                .ForMember(dest => dest.SenderName, opt => opt.MapFrom(src => src.SenderName))
                .ForMember(dest => dest.ReceiverName, opt => opt.MapFrom(src => src.ReceiverName));

            // Mapeo de ChatMessageRequest a ChatMessage (para crear nuevos mensajes)
            CreateMap<ChatMessageRequest, ChatMessage>()
                .ForMember(dest => dest.MessageID, opt => opt.Ignore())
                .ForMember(dest => dest.SenderID, opt => opt.Ignore())
                .ForMember(dest => dest.IsRead, opt => opt.Ignore())
                .ForMember(dest => dest.Timestamp, opt => opt.Ignore())
                .ForMember(dest => dest.SenderName, opt => opt.Ignore())
                .ForMember(dest => dest.ReceiverName, opt => opt.Ignore());
        }
    }
} 