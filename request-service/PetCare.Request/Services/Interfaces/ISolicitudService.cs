using PetCareServicios.Models.Solicitudes;

namespace PetCareServicios.Services.Interfaces
{
    public interface ISolicitudService
    {
        Task<List<SolicitudResponse>> GetAllSolicitudesAsync();
        Task<SolicitudResponse?> GetSolicitudByIdAsync(int id);
        Task<List<SolicitudResponse>> GetSolicitudesByClienteAsync(int clienteId);
        Task<List<SolicitudResponse>> GetSolicitudesByCuidadorAsync(int cuidadorId);
        Task<List<SolicitudResponse>> GetSolicitudesByEstadoAsync(string estado);
        Task<SolicitudResponse> CreateSolicitudAsync(int clienteId, SolicitudRequest request);
        Task<SolicitudResponse?> UpdateSolicitudAsync(int id, SolicitudRequest request);
        Task<SolicitudResponse?> UpdateSolicitudEstadoAsync(int id, SolicitudEstadoRequest request);
        Task<SolicitudResponse?> AsignarCuidadorAsync(int id, AsignarCuidadorRequest request);
        Task<bool> DeleteSolicitudAsync(int id);
        Task<bool> CancelarSolicitudAsync(int id);
        Task<bool> AceptarSolicitudAsync(int id);
        Task<bool> RechazarSolicitudAsync(int id);
        Task<bool> IniciarServicioAsync(int id);
        Task<bool> FinalizarServicioAsync(int id);
    }
} 