using Microsoft.EntityFrameworkCore;
using AutoMapper;
using PetCareServicios.Data;
using PetCareServicios.Models.Solicitudes;
using PetCareServicios.Services.Interfaces;
using System.Net.Http;

namespace PetCareServicios.Services
{
    public class SolicitudService : ISolicitudService
    {
        private readonly RequestDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public SolicitudService(RequestDbContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<List<SolicitudResponse>> GetAllSolicitudesAsync()
        {
            var solicitudes = await _context.Solicitudes
                .OrderByDescending(s => s.FechaCreacion)
                .ToListAsync();

            return _mapper.Map<List<SolicitudResponse>>(solicitudes);
        }

        public async Task<SolicitudResponse?> GetSolicitudByIdAsync(int id)
        {
            var solicitud = await _context.Solicitudes
                .FirstOrDefaultAsync(s => s.SolicitudID == id);

            return solicitud != null ? _mapper.Map<SolicitudResponse>(solicitud) : null;
        }

        public async Task<List<SolicitudResponse>> GetSolicitudesByClienteAsync(int clienteId)
        {
            var solicitudes = await _context.Solicitudes
                .Where(s => s.ClienteID == clienteId)
                .OrderByDescending(s => s.FechaCreacion)
                .ToListAsync();

            return _mapper.Map<List<SolicitudResponse>>(solicitudes);
        }

        public async Task<List<SolicitudResponse>> GetSolicitudesByCuidadorAsync(int cuidadorId)
        {
            var solicitudes = await _context.Solicitudes
                .Where(s => s.CuidadorID == cuidadorId)
                .OrderByDescending(s => s.FechaCreacion)
                .ToListAsync();

            return _mapper.Map<List<SolicitudResponse>>(solicitudes);
        }

        public async Task<List<SolicitudResponse>> GetSolicitudesByEstadoAsync(string estado)
        {
            var solicitudes = await _context.Solicitudes
                .Where(s => s.Estado == estado)
                .OrderByDescending(s => s.FechaCreacion)
                .ToListAsync();

            return _mapper.Map<List<SolicitudResponse>>(solicitudes);
        }

        public async Task<SolicitudResponse> CreateSolicitudAsync(int usuarioId, SolicitudRequest request)
        {
            var solicitud = new Solicitud
            {
                ClienteID = usuarioId,
                CuidadorID = null, // SIEMPRE null al crear
                TipoServicio = request.TipoServicio,
                Descripcion = request.Descripcion,
                FechaHoraInicio = request.FechaHoraInicio,
                DuracionHoras = request.DuracionHoras,
                Ubicacion = request.Ubicacion,
                Estado = "Pendiente",
                FechaCreacion = DateTime.UtcNow
            };
            _context.Solicitudes.Add(solicitud);
            await _context.SaveChangesAsync();
            return _mapper.Map<SolicitudResponse>(solicitud);
        }

        public async Task<SolicitudResponse?> UpdateSolicitudAsync(int id, SolicitudRequest request)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return null;

            // Solo permitir actualización si está en estado Pendiente
            if (solicitud.Estado != "Pendiente")
            {
                throw new InvalidOperationException("No se puede modificar una solicitud que no esté en estado Pendiente");
            }

            solicitud.TipoServicio = request.TipoServicio;
            solicitud.Descripcion = request.Descripcion;
            solicitud.FechaHoraInicio = request.FechaHoraInicio;
            solicitud.DuracionHoras = request.DuracionHoras;
            solicitud.Ubicacion = request.Ubicacion;
            solicitud.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<SolicitudResponse>(solicitud);
        }

        public async Task<SolicitudResponse?> UpdateSolicitudEstadoAsync(int id, SolicitudEstadoRequest request)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return null;

            solicitud.Estado = request.Estado;
            solicitud.FechaActualizacion = DateTime.UtcNow;

            // Actualizar fechas específicas según el estado
            switch (request.Estado.ToLower())
            {
                case "aceptada":
                    solicitud.FechaAceptacion = DateTime.UtcNow;
                    break;
                case "en progreso":
                    solicitud.FechaInicioServicio = DateTime.UtcNow;
                    break;
                case "finalizada":
                    solicitud.FechaFinalizacion = DateTime.UtcNow;
                    break;
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<SolicitudResponse>(solicitud);
        }

        public async Task<SolicitudResponse?> AsignarCuidadorAsync(int id, AsignarCuidadorRequest request, string? authToken = null)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return null;

            if (solicitud.Estado != "Pendiente")
            {
                throw new InvalidOperationException("Solo se puede asignar cuidador a solicitudes pendientes");
            }

            // Validar que el cuidador existe y está disponible
            if (!await ValidarCuidadorExisteAsync(request.CuidadorID, authToken))
            {
                throw new InvalidOperationException($"El cuidador con ID {request.CuidadorID} no existe, no está activo, o no tiene documento verificado");
            }

            solicitud.CuidadorID = request.CuidadorID;
            solicitud.Estado = "Asignada";
            solicitud.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<SolicitudResponse>(solicitud);
        }

        private async Task<bool> ValidarCuidadorExisteAsync(int cuidadorId, string? authToken = null)
        {
            try
            {
                using var httpClient = new HttpClient();

                // Configurar el cliente HTTP
                httpClient.Timeout = TimeSpan.FromSeconds(10);

                // Agregar el token de autorización si está disponible
                if (!string.IsNullOrEmpty(authToken))
                {
                    httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", authToken);
                    Console.WriteLine($"🔐 Token de autorización agregado a la petición");
                }
                else
                {
                    Console.WriteLine($"⚠️ No se proporcionó token de autorización");
                }

                // URL del servicio de cuidadores desde configuración
                var cuidadorServiceUrl = _configuration["Services:CuidadorServiceUrl"] ?? "http://localhost:5044";
                var url = $"{cuidadorServiceUrl}/api/cuidador/{cuidadorId}/validar";

                Console.WriteLine($"🔍 Validando cuidador {cuidadorId} en URL: {url}");

                var response = await httpClient.GetAsync(url);

                Console.WriteLine($"📊 Respuesta del servicio de cuidadores: {response.StatusCode}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"✅ Cuidador encontrado: {content}");
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"❌ Error en respuesta: {errorContent}");

                    // Si el cuidador no existe o no está activo, devolver false
                    if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        Console.WriteLine($"❌ Cuidador {cuidadorId} no encontrado");
                        return false;
                    }
                    else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    {
                        Console.WriteLine($"❌ Error de autorización al validar cuidador {cuidadorId}");
                        return false;
                    }

                    return false;
                }
            }
            catch (Exception ex)
            {
                // Log del error (en producción usar ILogger)
                Console.WriteLine($"❌ Error validando cuidador {cuidadorId}: {ex.Message}");
                Console.WriteLine($"📋 Stack trace: {ex.StackTrace}");
                return false;
            }
        }

        public async Task<bool> DeleteSolicitudAsync(int id)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return false;

            // Solo permitir eliminación si está en estado Pendiente
            if (solicitud.Estado != "Pendiente")
            {
                throw new InvalidOperationException("No se puede eliminar una solicitud que no esté en estado Pendiente");
            }

            _context.Solicitudes.Remove(solicitud);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> CancelarSolicitudAsync(int id)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return false;

            // Solo permitir cancelación si está en estado Pendiente o Asignada
            if (solicitud.Estado != "Pendiente" && solicitud.Estado != "Asignada")
            {
                throw new InvalidOperationException("No se puede cancelar una solicitud que ya esté en progreso o finalizada");
            }

            solicitud.Estado = "Cancelada";
            solicitud.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AceptarSolicitudAsync(int id)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return false;

            if (solicitud.Estado != "Asignada")
            {
                throw new InvalidOperationException("Solo se puede aceptar una solicitud que esté asignada");
            }

            solicitud.Estado = "Aceptada";
            solicitud.FechaAceptacion = DateTime.UtcNow;
            solicitud.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RechazarSolicitudAsync(int id)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return false;

            if (solicitud.Estado != "Asignada")
            {
                throw new InvalidOperationException("Solo se puede rechazar una solicitud que esté asignada");
            }

            solicitud.Estado = "Rechazada";
            solicitud.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IniciarServicioAsync(int id)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return false;

            if (solicitud.Estado != "Aceptada")
            {
                throw new InvalidOperationException("Solo se puede iniciar un servicio que esté aceptado");
            }

            solicitud.Estado = "En Progreso";
            solicitud.FechaInicioServicio = DateTime.UtcNow;
            solicitud.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> FinalizarServicioAsync(int id)
        {
            var solicitud = await _context.Solicitudes.FindAsync(id);
            if (solicitud == null) return false;

            if (solicitud.Estado != "En Progreso")
            {
                throw new InvalidOperationException("Solo se puede finalizar un servicio que esté en progreso");
            }

            solicitud.Estado = "Finalizada";
            solicitud.FechaFinalizacion = DateTime.UtcNow;
            solicitud.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }
        
        public async Task<bool> GuardarValoracionAsync(int solicitudId, int rating, string comentario)
        {
            var solicitud = await _context.Solicitudes.FindAsync(solicitudId);
            if (solicitud == null)
                return false;

            solicitud.Rating = rating;
            solicitud.Comentario = comentario;

            await _context.SaveChangesAsync();
            return true;
        }

    }
} 