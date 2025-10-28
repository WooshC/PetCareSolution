using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PetCare.Calificar.Data;
using PetCare.Calificar.Models;
using System.Net.Http.Json;

namespace PetCare.Calificar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly string _solicitudesServiceUrl;

        public RatingsController(AppDbContext context, HttpClient httpClient, IOptions<AppSettings> config)
        {
            _context = context;
            _httpClient = httpClient;
            _solicitudesServiceUrl = config.Value.Services.SolicitudesServiceUrl;
        }

        // GET: api/ratings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ratings>>> GetRatings()
        {
            return await _context.Ratings.ToListAsync();
        }

        // GET: api/ratings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ratings>> GetRating(int id)
        {
            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null) return NotFound();
            return rating;
        }

        // POST: api/ratings
        [HttpPost]
        public async Task<ActionResult<Ratings>> PostRating(Ratings rating)
        {
            // Validar que la solicitud existe en el microservicio de solicitudes
            var response = await _httpClient.GetAsync($"{_solicitudesServiceUrl}/{rating.RequestId}");
            if (!response.IsSuccessStatusCode)
                return BadRequest("La solicitud no existe");

            var solicitud = await response.Content.ReadFromJsonAsync<SolicitudResponseDto>();
            if (solicitud == null)
                return BadRequest("No se pudo obtener la solicitud");

            // Validar que el servicio esté finalizado
            if (solicitud.FechaFinalizacion == null)
                return BadRequest("El servicio aún no ha finalizado");

            // Validar que solo el cliente que hizo la solicitud puede calificar
            if (solicitud.ClienteID!= rating.ClienteID)
                return BadRequest("Solo el cliente que solicitó el servicio puede calificarlo");

            rating.CreatedAt = DateTime.UtcNow;
            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRating), new { id = rating.CalificacionID }, rating);
        }

        // PUT: api/ratings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRating(int id, Ratings rating)
        {
            if (id != rating.CalificacionID) return BadRequest();

            _context.Entry(rating).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Ratings.Any(r => r.CalificacionID == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/ratings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null) return NotFound();

            _context.Ratings.Remove(rating);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/ratings/cuidador/5
        [HttpGet("cuidador/{cuidadorId}")]
        public async Task<ActionResult<IEnumerable<Ratings>>> GetRatingsByCuidador(int cuidadorId)
        {
            var ratings = await _context.Ratings
                                        .Where(r => r.CuidadorID == cuidadorId)
                                        .ToListAsync();

            if (!ratings.Any()) return NotFound();
            return ratings;
        }

        // GET: api/ratings/cuidador/5/promedio
        [HttpGet("cuidador/{cuidadorId}/promedio")]
        public async Task<ActionResult<double>> GetPromedioByCuidador(int cuidadorId)
        {
            var ratings = await _context.Ratings
                                        .Where(r => r.CuidadorID == cuidadorId)
                                        .ToListAsync();

            if (!ratings.Any()) return 0;

            return ratings.Average(r => r.Score);
        }
    }
}
