using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PetCareServicios.Config;
using PetCareServicios.Data;
using PetCareServicios.Services;
using PetCareServicios.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Configuración de entorno y archivos de configuración
var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
Console.WriteLine($"🔧 Entorno detectado: {environment}");

if (environment == "Docker")
{
    builder.Configuration.AddJsonFile("appsettings.Docker.json", optional: true);
    Console.WriteLine("📁 Cargando configuración Docker");
}
else
{
    builder.Configuration.AddJsonFile("appsettings.json", optional: true);
    Console.WriteLine("📁 Cargando configuración local");
}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "PetCare.Cliente API", Version = "v1" });
    // JWT Bearer en Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Ejemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// DbContext
builder.Services.AddDbContext<ClienteDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Default")
        ?? throw new InvalidOperationException("No se encontró connection string configurada");
    options.UseSqlServer(connectionString);
    Console.WriteLine($"🔗 Connection string cargada: {connectionString}");
});

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key no configurada")))
    };
});

// Servicios
builder.Services.AddScoped<IClienteService, ClienteService>();

var app = builder.Build();

// Configurar URLs para Docker
if (app.Environment.EnvironmentName == "Docker")
{
    app.Urls.Clear();
    app.Urls.Add("http://0.0.0.0:8080"); // Docker expone en 5009 externo
}

// Middleware
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Aplicar migraciones automáticas con feedback
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ClienteDbContext>();
    try
    {
        Console.WriteLine("🔄 Iniciando aplicación de migraciones...");
        db.Database.Migrate();
        Console.WriteLine("✅ Migraciones aplicadas exitosamente a ClienteDbContext");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error al aplicar migraciones: {ex.Message}");
        throw;
    }
}

Console.WriteLine($"🚀 PetCare Cliente Service iniciado...");
Console.WriteLine($"📊 Entorno: {app.Environment.EnvironmentName}");
Console.WriteLine($"🌐 URL: {app.Urls.FirstOrDefault() ?? "No configurada"}");
app.Run();
