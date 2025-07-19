using System.ComponentModel.DataAnnotations;

namespace PetCareServicios.Models.Auth
{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(Cliente|Cuidador)$", ErrorMessage = "El rol debe ser 'Cliente' o 'Cuidador'")]
        public string Role { get; set; } = "Cliente";
    }
} 