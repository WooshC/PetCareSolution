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
        private readonly IConfiguration _configuration;

        public SolicitudController(ISolicitudService solicitudService, IConfiguration configuration)
        {
            _solicitudService = solicitudService;
            _configuration = configuration;
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
                // Extraer el token JWT del header de autorización
                var authToken = GetAuthTokenFromHeader();

                var solicitud = await _solicitudService.AsignarCuidadorAsync(id, request, authToken);
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

        // GET: api/solicitud/debug-cuidador/{id}
        [HttpGet("debug-cuidador/{id}")]
        [Authorize]
        public async Task<ActionResult<object>> DebugCuidador(int id)
        {
            try
            {
                var cuidadorServiceUrl = _configuration["Services:CuidadorServiceUrl"] ?? "http://localhost:5044";
                var url = $"{cuidadorServiceUrl}/api/cuidador/{id}/validar";
                
                using var httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromSeconds(10);
                
                // Extraer y agregar el token de autorización
                var authToken = GetAuthTokenFromHeader();
                if (!string.IsNullOrEmpty(authToken))
                {
                    httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", authToken);
                }
                
                var response = await httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();
                
                return Ok(new
                {
                    message = "Debug de validación de cuidador",
                    cuidadorId = id,
                    cuidadorServiceUrl = cuidadorServiceUrl,
                    fullUrl = url,
                    authTokenProvided = !string.IsNullOrEmpty(authToken),
                    statusCode = (int)response.StatusCode,
                    statusCodeText = response.StatusCode.ToString(),
                    isSuccess = response.IsSuccessStatusCode,
                    responseContent = content,
                    headers = response.Headers.ToDictionary(h => h.Key, h => h.Value)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    message = "Error al validar cuidador", 
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
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

        // Método auxiliar para extraer el token JWT del header de autorización
        private string? GetAuthTokenFromHeader()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                return authHeader.Substring("Bearer ".Length);
            }
            return null;
        }
    }
} 