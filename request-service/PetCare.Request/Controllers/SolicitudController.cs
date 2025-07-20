using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using PetCareServicios.Models.Solicitudes;
using PetCareServicios.Services.Interfaces;

namespace PetCareServicios.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SolicitudController : ControllerBase
    {
        private readonly ISolicitudService _solicitudService;

        public SolicitudController(ISolicitudService solicitudService)
        {
            _solicitudService = solicitudService;
        }

        // GET: api/solicitud
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<SolicitudResponse>>> GetAllSolicitudes()
        {
            try
            {
                var solicitudes = await _solicitudService.GetAllSolicitudesAsync();
                return Ok(solicitudes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // GET: api/solicitud/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SolicitudResponse>> GetSolicitud(int id)
        {
            try
            {
                var solicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (solicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                // Verificar que el usuario tenga acceso a esta solicitud
                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();
                
                if (userRole != "Admin" && solicitud.ClienteID != currentUserId && solicitud.CuidadorID != currentUserId)
                {
                    return Forbid();
                }

                return Ok(solicitud);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // GET: api/solicitud/cliente/{clienteId}
        [HttpGet("cliente/{clienteId}")]
        public async Task<ActionResult<List<SolicitudResponse>>> GetSolicitudesByCliente(int clienteId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();
                
                // Solo el cliente puede ver sus propias solicitudes, o un admin
                if (userRole != "Admin" && currentUserId != clienteId)
                {
                    return Forbid();
                }

                var solicitudes = await _solicitudService.GetSolicitudesByClienteAsync(clienteId);
                return Ok(solicitudes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // GET: api/solicitud/cuidador/{cuidadorId}
        [HttpGet("cuidador/{cuidadorId}")]
        public async Task<ActionResult<List<SolicitudResponse>>> GetSolicitudesByCuidador(int cuidadorId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();
                
                // Solo el cuidador puede ver sus propias solicitudes, o un admin
                if (userRole != "Admin" && currentUserId != cuidadorId)
                {
                    return Forbid();
                }

                var solicitudes = await _solicitudService.GetSolicitudesByCuidadorAsync(cuidadorId);
                return Ok(solicitudes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // GET: api/solicitud/estado/{estado}
        [HttpGet("estado/{estado}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<SolicitudResponse>>> GetSolicitudesByEstado(string estado)
        {
            try
            {
                var solicitudes = await _solicitudService.GetSolicitudesByEstadoAsync(estado);
                return Ok(solicitudes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // GET: api/solicitud/mis-solicitudes
        [HttpGet("mis-solicitudes")]
        public async Task<ActionResult<List<SolicitudResponse>>> GetMisSolicitudes()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();
                
                List<SolicitudResponse> solicitudes;
                
                if (userRole == "Cliente")
                {
                    solicitudes = await _solicitudService.GetSolicitudesByClienteAsync(currentUserId);
                }
                else if (userRole == "Cuidador")
                {
                    solicitudes = await _solicitudService.GetSolicitudesByCuidadorAsync(currentUserId);
                }
                else
                {
                    return BadRequest(new { message = "Rol no válido para esta operación" });
                }

                return Ok(solicitudes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // POST: api/solicitud
        [HttpPost]
        [Authorize(Roles = "Cliente")]
        public async Task<ActionResult<SolicitudResponse>> CreateSolicitud([FromBody] SolicitudRequest request)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var solicitud = await _solicitudService.CreateSolicitudAsync(currentUserId, request);
                
                return CreatedAtAction(nameof(GetSolicitud), new { id = solicitud.SolicitudID }, solicitud);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // PUT: api/solicitud/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Cliente")]
        public async Task<ActionResult<SolicitudResponse>> UpdateSolicitud(int id, [FromBody] SolicitudRequest request)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                
                // Verificar que la solicitud pertenece al usuario actual
                var existingSolicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (existingSolicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }
                
                if (existingSolicitud.ClienteID != currentUserId)
                {
                    return Forbid();
                }

                var solicitud = await _solicitudService.UpdateSolicitudAsync(id, request);
                if (solicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(solicitud);
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

        // PUT: api/solicitud/{id}/estado
        [HttpPut("{id}/estado")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SolicitudResponse>> UpdateSolicitudEstado(int id, [FromBody] SolicitudEstadoRequest request)
        {
            try
            {
                var solicitud = await _solicitudService.UpdateSolicitudEstadoAsync(id, request);
                if (solicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(solicitud);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // PUT: api/solicitud/{id}/asignar-cuidador
        [HttpPut("{id}/asignar-cuidador")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SolicitudResponse>> AsignarCuidador(int id, [FromBody] AsignarCuidadorRequest request)
        {
            try
            {
                var solicitud = await _solicitudService.AsignarCuidadorAsync(id, request);
                if (solicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(solicitud);
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

        // PUT: api/solicitud/{id}/asignar-cuidador-cliente
        [HttpPut("{id}/asignar-cuidador-cliente")]
        [Authorize(Roles = "Cliente")]
        public async Task<ActionResult<SolicitudResponse>> AsignarCuidadorCliente(int id, [FromBody] AsignarCuidadorRequest request)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                
                // Verificar que la solicitud pertenece al cliente actual
                var existingSolicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (existingSolicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }
                
                if (existingSolicitud.ClienteID != currentUserId)
                {
                    return Forbid();
                }

                var solicitud = await _solicitudService.AsignarCuidadorAsync(id, request);
                if (solicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(solicitud);
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

        // DELETE: api/solicitud/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Cliente")]
        public async Task<ActionResult> DeleteSolicitud(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                
                // Verificar que la solicitud pertenece al usuario actual
                var existingSolicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (existingSolicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }
                
                if (existingSolicitud.ClienteID != currentUserId)
                {
                    return Forbid();
                }

                var result = await _solicitudService.DeleteSolicitudAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return NoContent();
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

        // POST: api/solicitud/{id}/cancelar
        [HttpPost("{id}/cancelar")]
        public async Task<ActionResult> CancelarSolicitud(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();
                
                // Verificar que la solicitud pertenece al usuario actual
                var existingSolicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (existingSolicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }
                
                if (userRole != "Admin" && existingSolicitud.ClienteID != currentUserId)
                {
                    return Forbid();
                }

                var result = await _solicitudService.CancelarSolicitudAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(new { message = "Solicitud cancelada exitosamente" });
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

        // POST: api/solicitud/{id}/aceptar
        [HttpPost("{id}/aceptar")]
        [Authorize(Roles = "Cuidador")]
        public async Task<ActionResult> AceptarSolicitud(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                
                // Verificar que la solicitud está asignada al cuidador actual
                var existingSolicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (existingSolicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }
                
                if (existingSolicitud.CuidadorID != currentUserId)
                {
                    return Forbid();
                }

                var result = await _solicitudService.AceptarSolicitudAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(new { message = "Solicitud aceptada exitosamente" });
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

        // POST: api/solicitud/{id}/rechazar
        [HttpPost("{id}/rechazar")]
        [Authorize(Roles = "Cuidador")]
        public async Task<ActionResult> RechazarSolicitud(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                
                // Verificar que la solicitud está asignada al cuidador actual
                var existingSolicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (existingSolicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }
                
                if (existingSolicitud.CuidadorID != currentUserId)
                {
                    return Forbid();
                }

                var result = await _solicitudService.RechazarSolicitudAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(new { message = "Solicitud rechazada exitosamente" });
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

        // POST: api/solicitud/{id}/iniciar-servicio
        [HttpPost("{id}/iniciar-servicio")]
        [Authorize(Roles = "Cuidador")]
        public async Task<ActionResult> IniciarServicio(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                
                // Verificar que la solicitud está asignada al cuidador actual
                var existingSolicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (existingSolicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }
                
                if (existingSolicitud.CuidadorID != currentUserId)
                {
                    return Forbid();
                }

                var result = await _solicitudService.IniciarServicioAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(new { message = "Servicio iniciado exitosamente" });
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

        // POST: api/solicitud/{id}/finalizar-servicio
        [HttpPost("{id}/finalizar-servicio")]
        [Authorize(Roles = "Cuidador")]
        public async Task<ActionResult> FinalizarServicio(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                
                // Verificar que la solicitud está asignada al cuidador actual
                var existingSolicitud = await _solicitudService.GetSolicitudByIdAsync(id);
                if (existingSolicitud == null)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }
                
                if (existingSolicitud.CuidadorID != currentUserId)
                {
                    return Forbid();
                }

                var result = await _solicitudService.FinalizarServicioAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Solicitud no encontrada" });
                }

                return Ok(new { message = "Servicio finalizado exitosamente" });
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

        // GET: api/solicitud/test
        [HttpGet("test")]
        [AllowAnonymous]
        public ActionResult<object> Test()
        {
            return Ok(new
            {
                message = "PetCare Request Service está funcionando correctamente",
                timestamp = DateTime.UtcNow,
                version = "1.0.0"
            });
        }

        // GET: api/solicitud/debug-token
        [HttpGet("debug-token")]
        [Authorize]
        public ActionResult<object> DebugToken()
        {
            try
            {
                var userId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();
                var userName = User.FindFirst(ClaimTypes.Name)?.Value;
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

                return Ok(new
                {
                    message = "Información del token JWT",
                    userId = userId,
                    userRole = userRole,
                    userName = userName,
                    userEmail = userEmail,
                    claims = User.Claims.Select(c => new { Type = c.Type, Value = c.Value }).ToList()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al decodificar token", error = ex.Message });
            }
        }

        // Métodos auxiliares para obtener información del usuario actual
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            throw new InvalidOperationException("Usuario no autenticado o ID de usuario inválido");
        }

        private string GetCurrentUserRole()
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            return roleClaim ?? "Usuario";
        }
    }
} 