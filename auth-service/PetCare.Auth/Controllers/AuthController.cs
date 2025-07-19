using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PetCareServicios.Models.Auth;
using PetCareServicios.Services;
using System.Security.Claims;

namespace PetCareServicios.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly UserManager<User> _userManager;

        public AuthController(AuthService authService, UserManager<User> userManager)
        {
            _authService = authService;
            _userManager = userManager;
        }

        /// <summary>
        /// Registro de nuevos usuarios
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(request);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Inicio de sesión (obtener JWT)
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(request);
            
            if (!result.Success)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Solicitar reset de contraseña
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<ActionResult<PasswordResetResponse>> RequestPasswordReset([FromBody] PasswordResetRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RequestPasswordResetAsync(request);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Confirmar reset de contraseña
        /// </summary>
        [HttpPost("confirm-reset")]
        public async Task<ActionResult<PasswordResetResponse>> ConfirmPasswordReset([FromBody] PasswordResetConfirmRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ConfirmPasswordResetAsync(request);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Cambio directo de contraseña (para testing)
        /// </summary>
        [HttpPost("change-password")]
        public async Task<ActionResult<PasswordResetResponse>> ChangePassword([FromBody] DirectPasswordChangeRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ChangePasswordAsync(request);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Obtener lista de usuarios (solo para desarrollo/testing)
        /// </summary>
        [HttpGet("users")]
        [AllowAnonymous] // Temporal para desarrollo
        public async Task<ActionResult<List<UserInfo>>> GetUsers()
        {
            var users = new List<UserInfo>();
            
            foreach (var user in _userManager.Users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                users.Add(new UserInfo
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    Name = user.Name ?? string.Empty,
                    CreatedAt = user.CreatedAt,
                    Roles = roles.ToList()
                });
            }

            return Ok(users);
        }

        /// <summary>
        /// Obtener información de un usuario específico
        /// </summary>
        [HttpGet("users/{id}")]
        [AllowAnonymous] // Temporal para desarrollo
        public async Task<ActionResult<UserInfo>> GetUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            
            if (user == null)
            {
                return NotFound("Usuario no encontrado");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userInfo = new UserInfo
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Name = user.Name ?? string.Empty,
                CreatedAt = user.CreatedAt,
                Roles = roles.ToList()
            };

            return Ok(userInfo);
        }

        /// <summary>
        /// Obtener información del usuario actual
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserInfo>> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound("Usuario no encontrado");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userInfo = new UserInfo
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Name = user.Name ?? string.Empty,
                CreatedAt = user.CreatedAt,
                Roles = roles.ToList()
            };

            return Ok(userInfo);
        }
    }
} 