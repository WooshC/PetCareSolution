using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PetCareServicios.Data;
using PetCareServicios.Services;
using PetCareServicios.Services.Interfaces;
using PetCareServicios.Config;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configurar la carga de archivos de configuración según el entorno
var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
Console.WriteLine($"🔧 Entorno detectado: {environment}");

// Cargar configuración específica del entorno
if (environment == "Docker")
{
    builder.Configuration.AddJsonFile("appsettings.Docker.json", optional: false);
    Console.WriteLine("📁 Cargando configuración Docker");
}
else
{
    builder.Configuration.AddJsonFile("appsettings.json", optional: false);
    Console.WriteLine("📁 Cargando configuración local");
}

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "PetCare Chat API",
        Version = "v1",
        Description = "API para mensajería y chat en PetCare"
    });

    // Configurar autenticación JWT en Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
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
            Array.Empty<string>()
        }
    });
});

Console.WriteLine("🔧 Registrando controladores...");

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
                origin == "http://localhost:5070" ||
                origin == "http://localhost:8088" ||
                origin == "http://127.0.0.1:5500" ||
                origin == "http://localhost:5500" ||
                origin == null)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Configurar SignalR
builder.Services.AddSignalR();

// Configurar HttpClient para comunicación con otros servicios
builder.Services.AddHttpClient();

// Obtener y mostrar la URL del Request Service
var requestServiceUrl = builder.Configuration["Services:RequestServiceUrl"];
Console.WriteLine($"🔗 Request Service URL: {requestServiceUrl}");
Console.WriteLine("   📍 Configurado para comunicación inter-servicios");
Console.WriteLine("   📍 Desarrollo Local: http://localhost:5050");
Console.WriteLine("   📍 Docker: http://petcare-request:8080");

// Configuración de JWT
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

    // Configurar JWT para SignalR
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chatHub"))
            {
                context.Token = accessToken;
            }
            
            return Task.CompletedTask;
        }
    };
});

// Configuración de DbContext
builder.Services.AddDbContext<ChatDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Default") 
        ?? throw new InvalidOperationException("No se encontró connection string configurada");
    
    options.UseSqlServer(connectionString);
    
    Console.WriteLine($"🔗 Connection string cargada:");
    Console.WriteLine($"   Server: {connectionString.Split(';').FirstOrDefault(s => s.StartsWith("Server="))?.Replace("Server=", "")}");
    Console.WriteLine($"   Database: {connectionString.Split(';').FirstOrDefault(s => s.StartsWith("Database="))?.Replace("Database=", "")}");
    Console.WriteLine($"   User: {connectionString.Split(';').FirstOrDefault(s => s.StartsWith("User Id="))?.Replace("User Id=", "")}");
    Console.WriteLine($"🔧 Entorno de configuración: {builder.Environment.EnvironmentName}");
});

// Configurar AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// Registrar servicios
builder.Services.AddScoped<IChatService, ChatService>();

var app = builder.Build();

// Configurar URLs para Docker
if (app.Environment.EnvironmentName == "Docker")
{
    app.Urls.Clear();
    app.Urls.Add("http://0.0.0.0:8080");
}

Console.WriteLine("🚀 Aplicación construida, iniciando configuración...");

// Configure the HTTP request pipeline.
// Habilitar Swagger en todos los entornos para desarrollo
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Mapear SignalR Hub
app.MapHub<PetCareServicios.Hubs.ChatHub>("/chatHub");

// ===== APLICACIÓN DE MIGRACIONES Y LOGS =====

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    
    try
    {
        Console.WriteLine("🔄 Iniciando aplicación de migraciones...");
        
        // Obtener el contexto de chat
        var chatContext = services.GetRequiredService<ChatDbContext>();

        // Aplicar migraciones con reintentos
        int maxRetries = 5;
        int currentRetry = 0;
        
        while (currentRetry < maxRetries)
        {
            try
            {
                Console.WriteLine($"📊 Aplicando migraciones a ChatDbContext (intento {currentRetry + 1}/{maxRetries})...");
                
                // Aplicar migraciones directamente (crea la BD si no existe)
                await chatContext.Database.MigrateAsync();
                Console.WriteLine($"✅ Migraciones aplicadas exitosamente a ChatDbContext");
                break; // Salir del bucle si es exitoso
            }
            catch (Exception ex)
            {
                currentRetry++;
                Console.WriteLine($"⚠️ Intento {currentRetry}/{maxRetries} falló: {ex.Message}");
                
                if (currentRetry >= maxRetries)
                {
                    throw; // Re-lanzar la excepción si se agotaron los intentos
                }
                
                // Esperar antes del siguiente intento (tiempo progresivo)
                int waitTime = currentRetry * 3; // 3, 6, 9, 12 segundos
                Console.WriteLine($"⏳ Esperando {waitTime} segundos antes del siguiente intento...");
                await Task.Delay(waitTime * 1000);
            }
        }

        Console.WriteLine("🎉 Proceso de migraciones completado");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error general al aplicar migraciones: {ex.Message}");
        Console.WriteLine($"📋 Stack trace: {ex.StackTrace}");
    }
}

// ===== INICIO DE LA APLICACIÓN =====

Console.WriteLine("🚀 PetCare Chat Service iniciando...");
Console.WriteLine($"📊 Entorno: {app.Environment.EnvironmentName}");

// Mostrar URLs configuradas
var urls = app.Urls.ToList();
if (urls.Any())
{
    Console.WriteLine("🌐 URLs configuradas:");
    foreach (var url in urls)
    {
        Console.WriteLine($"   📍 {url}");
        if (url.Contains("localhost"))
        {
            Console.WriteLine($"   🔗 Swagger UI: {url}/swagger");
            Console.WriteLine($"   🔗 SignalR Hub: {url}/chatHub");
        }
    }
}
else
{
    Console.WriteLine("🌐 URLs: Se configurarán automáticamente al iniciar");
    Console.WriteLine("   📍 Esperado: http://localhost:5070");
    Console.WriteLine("   🔗 Swagger UI: http://localhost:5070/swagger");
    Console.WriteLine("   🔗 SignalR Hub: http://localhost:5070/chatHub");
}

// Mostrar configuración de servicios
Console.WriteLine($"🔗 Request Service URL: {requestServiceUrl ?? "No configurada"}");

app.Run();
