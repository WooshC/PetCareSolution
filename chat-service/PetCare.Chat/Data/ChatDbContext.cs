using Microsoft.EntityFrameworkCore;
using PetCareServicios.Models.Chat;

namespace PetCareServicios.Data
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
        {
        }

        public DbSet<ChatMessage> ChatMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configuración de la tabla ChatMessages
            builder.Entity<ChatMessage>(entity =>
            {
                entity.HasKey(e => e.MessageID);
                entity.Property(e => e.MessageID).ValueGeneratedOnAdd();
                
                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.MessageType).HasDefaultValue("Text");
                entity.Property(e => e.IsRead).HasDefaultValue(false);
                entity.Property(e => e.Timestamp).HasDefaultValueSql("GETUTCDATE()");
                
                // Índices para mejorar el rendimiento
                entity.HasIndex(e => new { e.SenderID, e.ReceiverID });
                entity.HasIndex(e => new { e.ReceiverID, e.IsRead });
                entity.HasIndex(e => e.Timestamp);
            });
        }
    }
} 