namespace PetCareServicios.Models.Solicitudes
{
    public class ValoracionRequest
    {
        public int Rating { get; set; }
        public string Comentario { get; set; } = string.Empty;
    }
}
