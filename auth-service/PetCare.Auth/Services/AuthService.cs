using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using PetCareServicios.Models.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _config;

    public AuthService(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
    }

    public async Task<AuthResponse> RegisterAsync(LoginRequest model)
    {
        var user = new User
        {
            UserName = model.Email,
            Email = model.Email,
            Name = model.Email.Split('@')[0] // Nombre por defecto
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                Success = false,
                Message = string.Join(", ", result.Errors.Select(e => e.Description))
            };
        }

        // Asignar rol por defecto (opcional)
        await _userManager.AddToRoleAsync(user, "Cliente");

        return new AuthResponse
        {
            Success = true,
            Token = await GenerateJwtToken(user),
            Message = "Registro exitoso"
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest model)
    {
        var result = await _signInManager.PasswordSignInAsync(
            model.Email, model.Password, false, false);

        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Credenciales inválidas"
            };
        }

        var user = await _userManager.FindByEmailAsync(model.Email);
        return new AuthResponse
        {
            Success = true,
            Token = await GenerateJwtToken(user),
            Message = "Inicio de sesión exitoso"
        };
    }

    private async Task<string> GenerateJwtToken(User user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(Convert.ToDouble(_config["Jwt:ExpireDays"]));

        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}