using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PetCareServicios.Models.Auth;
using PetCareServicios.Data;
using PetCareServicios.Services;
using PetCareServicios.Config;
using System.Text;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Cargar configuración externa de base de datos
var databaseConfigPath = Path.Combine(builder.Environment.ContentRootPath, "config", "database.json");
var dockerConfigPath = Path.Combine(builder.Environment.ContentRootPath, "config", "database.docker.json");

// Detectar si estamos en Docker o desarrollo local
var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true" || 
               Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Docker";

if (isDocker && File.Exists(dockerConfigPath))
{
    builder.Configuration.AddJsonFile(dockerConfigPath, optional: false, reloadOnChange: true);
    Console.WriteLine($"🐳 Configuración de Docker cargada desde: {dockerConfigPath}");
}
else if (File.Exists(databaseConfigPath))
{
    builder.Configuration.AddJsonFile(databaseConfigPath, optional: false, reloadOnChange: true);
    Console.WriteLine($"✅ Configuración de base de datos cargada desde: {databaseConfigPath}");
}
else
{
    Console.WriteLine($"⚠️ Archivo de configuración de base de datos no encontrado");
    Console.WriteLine("📝 Usando configuración por defecto del appsettings.json");
}

// Configurar opciones de base de datos
builder.Services.Configure<DatabaseConfig>(builder.Configuration.GetSection("DatabaseConfig"));
builder.Services.Configure<DatabaseConfig>(builder.Configuration);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de Identity
builder.Services.AddIdentity<User, UserRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AuthDbContext>()
.AddDefaultTokenProviders();

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
});

// Configuración de DbContext con configuración externa
builder.Services.AddDbContext<AuthDbContext>((serviceProvider, options) =>
{
    var databaseConfig = serviceProvider.GetRequiredService<IOptions<DatabaseConfig>>().Value;
    var environment = serviceProvider.GetRequiredService<IWebHostEnvironment>();
    
    // Seleccionar connection string según el entorno
    string connectionString;
    switch (environment.EnvironmentName.ToLower())
    {
        case "development":
            connectionString = databaseConfig.ConnectionStrings.Development;
            break;
        case "testing":
            connectionString = databaseConfig.ConnectionStrings.Testing;
            break;
        case "production":
            connectionString = databaseConfig.ConnectionStrings.Production;
            break;
        default:
            connectionString = databaseConfig.ConnectionStrings.Default;
            break;
    }
    
    if (string.IsNullOrEmpty(connectionString))
    {
        // Fallback a appsettings.json
        connectionString = builder.Configuration.GetConnectionString("Default") 
            ?? throw new InvalidOperationException("No se encontró connection string configurada");
    }
    
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.CommandTimeout(databaseConfig.DatabaseSettings.CommandTimeout);
        
        if (databaseConfig.DatabaseSettings.EnableRetryOnFailure)
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: databaseConfig.DatabaseSettings.MaxRetryCount,
                maxRetryDelay: TimeSpan.FromSeconds(databaseConfig.DatabaseSettings.RetryDelay),
                errorNumbersToAdd: null);
        }
    });
    
    Console.WriteLine($"🔗 Usando connection string para entorno: {environment.EnvironmentName}");
});

// Registrar servicios
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Aplicar migraciones automáticamente en desarrollo
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        
        // Aplicar migraciones pendientes
        try
        {
            context.Database.Migrate();
            Console.WriteLine("✅ Migraciones aplicadas correctamente");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error al aplicar migraciones: {ex.Message}");
        }
        
        // Crear roles por defecto si no existen
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<UserRole>>();
        var roles = new[] { "Admin", "Cliente", "Cuidador" };
        
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new UserRole { Name = role, Description = $"Rol de {role}" });
                Console.WriteLine($"✅ Rol '{role}' creado");
            }
        }
        
        Console.WriteLine("✅ Inicialización de la base de datos completada");
    }
}

app.Run();

