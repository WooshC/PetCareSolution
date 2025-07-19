using Microsoft.EntityFrameworkCore;
using PetCareServicios.Data;
using PetCareServicios.Models.Cuidadores;
using PetCareServicios.Services.Interfaces;
using AutoMapper;

namespace PetCareServicios.Services
{
    public class CuidadorService : ICuidadorService
    {
        private readonly CuidadorDbContext _context;
        private readonly IMapper _mapper;

        public CuidadorService(CuidadorDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<CuidadorResponse>> GetAllCuidadoresAsync()
        {
            var cuidadores = await _context.Cuidadores
                .Where(c => c.Estado == "Activo")
                .ToListAsync();

            return _mapper.Map<List<CuidadorResponse>>(cuidadores);
        }

        public async Task<CuidadorResponse?> GetCuidadorByIdAsync(int id)
        {
            var cuidador = await _context.Cuidadores
                .FirstOrDefaultAsync(c => c.CuidadorID == id && c.Estado == "Activo");

            return _mapper.Map<CuidadorResponse>(cuidador);
        }

        public async Task<CuidadorResponse?> GetCuidadorByUsuarioIdAsync(int usuarioId)
        {
            var cuidador = await _context.Cuidadores
                .FirstOrDefaultAsync(c => c.UsuarioID == usuarioId && c.Estado == "Activo");

            return _mapper.Map<CuidadorResponse>(cuidador);
        }

        public async Task<CuidadorResponse> CreateCuidadorAsync(int usuarioId, CuidadorRequest request)
        {
            // Verificar que no exista ya un perfil para este usuario
            var existingCuidador = await _context.Cuidadores
                .FirstOrDefaultAsync(c => c.UsuarioID == usuarioId);

            if (existingCuidador != null)
            {
                throw new InvalidOperationException("Ya existe un perfil de cuidador para este usuario");
            }

            // Verificar que el documento de identidad no esté duplicado
            var existingDocument = await _context.Cuidadores
                .FirstOrDefaultAsync(c => c.DocumentoIdentidad == request.DocumentoIdentidad);

            if (existingDocument != null)
            {
                throw new InvalidOperationException("El documento de identidad ya está registrado");
            }

            var cuidador = new Cuidador
            {
                UsuarioID = usuarioId,
                DocumentoIdentidad = request.DocumentoIdentidad,
                TelefonoEmergencia = request.TelefonoEmergencia,
                Biografia = request.Biografia,
                Experiencia = request.Experiencia,
                HorarioAtencion = request.HorarioAtencion,
                TarifaPorHora = request.TarifaPorHora,
                Estado = "Activo",
                FechaCreacion = DateTime.UtcNow
            };

            _context.Cuidadores.Add(cuidador);
            await _context.SaveChangesAsync();

            return _mapper.Map<CuidadorResponse>(cuidador);
        }

        public async Task<CuidadorResponse?> UpdateCuidadorAsync(int id, CuidadorRequest request)
        {
            var cuidador = await _context.Cuidadores
                .FirstOrDefaultAsync(c => c.CuidadorID == id && c.Estado == "Activo");

            if (cuidador == null)
                return null;

            // Verificar que el documento de identidad no esté duplicado (si cambió)
            if (cuidador.DocumentoIdentidad != request.DocumentoIdentidad)
            {
                var existingDocument = await _context.Cuidadores
                    .FirstOrDefaultAsync(c => c.DocumentoIdentidad == request.DocumentoIdentidad && c.CuidadorID != id);

                if (existingDocument != null)
                {
                    throw new InvalidOperationException("El documento de identidad ya está registrado");
                }
            }

            // Actualizar propiedades
            cuidador.DocumentoIdentidad = request.DocumentoIdentidad;
            cuidador.TelefonoEmergencia = request.TelefonoEmergencia;
            cuidador.Biografia = request.Biografia;
            cuidador.Experiencia = request.Experiencia;
            cuidador.HorarioAtencion = request.HorarioAtencion;
            cuidador.TarifaPorHora = request.TarifaPorHora;
            cuidador.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<CuidadorResponse>(cuidador);
        }

        public async Task<bool> DeleteCuidadorAsync(int id)
        {
            var cuidador = await _context.Cuidadores
                .FirstOrDefaultAsync(c => c.CuidadorID == id && c.Estado == "Activo");

            if (cuidador == null)
                return false;

            // Soft delete - cambiar estado a "Eliminado"
            cuidador.Estado = "Eliminado";
            cuidador.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> VerificarDocumentoAsync(int id)
        {
            var cuidador = await _context.Cuidadores
                .FirstOrDefaultAsync(c => c.CuidadorID == id && c.Estado == "Activo");

            if (cuidador == null)
                return false;

            cuidador.DocumentoVerificado = true;
            cuidador.FechaVerificacion = DateTime.UtcNow;
            cuidador.FechaActualizacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
} 