# Script para gestionar configuraciones de entorno en PetCare
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "docker", "prod", "show")]
    [string]$Environment
)

Write-Host "🔧 Gestor de Entornos - PetCare" -ForegroundColor Cyan
Write-Host ""

$authServicePath = "auth-service/PetCare.Auth"

switch ($Environment) {
    "dev" {
        Write-Host "🖥️ Configurando para DESARROLLO LOCAL..." -ForegroundColor Green
        
        # Usar LocalDB para desarrollo
        $devConfig = @{
            ConnectionStrings = @{
                Default = "Server=(localdb)\mssqllocaldb;Database=PetCareAuth;Trusted_Connection=true;MultipleActiveResultSets=true"
                Development = "Server=(localdb)\mssqllocaldb;Database=PetCareAuth_Dev;Trusted_Connection=true;MultipleActiveResultSets=true"
                Testing = "Server=(localdb)\mssqllocaldb;Database=PetCareAuth_Test;Trusted_Connection=true;MultipleActiveResultSets=true"
                Production = "Server=prod-server;Database=PetCareAuth_Prod;User=petcare_user;Password=SecurePassword123;TrustServerCertificate=true;"
            }
            DatabaseSettings = @{
                CommandTimeout = 30
                EnableRetryOnFailure = $true
                MaxRetryCount = 3
                RetryDelay = 5
            }
        }
        
        $devConfig | ConvertTo-Json -Depth 10 | Set-Content "$authServicePath/config/database.json"
        Write-Host "✅ Configuración de desarrollo aplicada" -ForegroundColor Green
        Write-Host "📝 Usando LocalDB en puerto local" -ForegroundColor Yellow
        Write-Host "🚀 Para ejecutar: cd $authServicePath && dotnet run" -ForegroundColor Cyan
    }
    
    "docker" {
        Write-Host "🐳 Configurando para DOCKER..." -ForegroundColor Green
        
        # Usar configuración de Docker
        $dockerConfig = @{
            ConnectionStrings = @{
                Default = "Server=db;Database=PetCareAuth;User=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
                Development = "Server=db;Database=PetCareAuth_Dev;User=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
                Testing = "Server=db;Database=PetCareAuth_Test;User=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
                Production = "Server=db;Database=PetCareAuth_Prod;User=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
            }
            DatabaseSettings = @{
                CommandTimeout = 60
                EnableRetryOnFailure = $true
                MaxRetryCount = 5
                RetryDelay = 10
            }
        }
        
        $dockerConfig | ConvertTo-Json -Depth 10 | Set-Content "$authServicePath/config/database.json"
        Write-Host "✅ Configuración de Docker aplicada" -ForegroundColor Green
        Write-Host "📝 Usando SQL Server en contenedor" -ForegroundColor Yellow
        Write-Host "🚀 Para ejecutar: docker-compose up -d" -ForegroundColor Cyan
    }
    
    "prod" {
        Write-Host "🏭 Configurando para PRODUCCIÓN..." -ForegroundColor Green
        
        # Usar configuración de producción
        $prodConfig = @{
            ConnectionStrings = @{
                Default = "Server=prod-server;Database=PetCareAuth;User=petcare_user;Password=SecurePassword123;TrustServerCertificate=true;"
                Development = "Server=prod-server;Database=PetCareAuth_Dev;User=petcare_user;Password=SecurePassword123;TrustServerCertificate=true;"
                Testing = "Server=prod-server;Database=PetCareAuth_Test;User=petcare_user;Password=SecurePassword123;TrustServerCertificate=true;"
                Production = "Server=prod-server;Database=PetCareAuth_Prod;User=petcare_user;Password=SecurePassword123;TrustServerCertificate=true;"
            }
            DatabaseSettings = @{
                CommandTimeout = 120
                EnableRetryOnFailure = $true
                MaxRetryCount = 10
                RetryDelay = 15
            }
        }
        
        $prodConfig | ConvertTo-Json -Depth 10 | Set-Content "$authServicePath/config/database.json"
        Write-Host "✅ Configuración de producción aplicada" -ForegroundColor Green
        Write-Host "⚠️ IMPORTANTE: Cambia las credenciales antes de desplegar" -ForegroundColor Red
    }
    
    "show" {
        Write-Host "📋 Configuración actual:" -ForegroundColor Green
        
        if (Test-Path "$authServicePath/config/database.json") {
            $config = Get-Content "$authServicePath/config/database.json" | ConvertFrom-Json
            
            Write-Host "Connection Strings:" -ForegroundColor Yellow
            $config.ConnectionStrings | Get-Member -MemberType NoteProperty | ForEach-Object {
                $env = $_.Name
                $conn = $config.ConnectionStrings.$env
                Write-Host "  $env`: $conn" -ForegroundColor White
            }
            
            Write-Host "Database Settings:" -ForegroundColor Yellow
            $config.DatabaseSettings | Get-Member -MemberType NoteProperty | ForEach-Object {
                $setting = $_.Name
                $value = $config.DatabaseSettings.$setting
                Write-Host "  $setting`: $value" -ForegroundColor White
            }
        } else {
            Write-Host "❌ No se encontró archivo de configuración" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "🎯 Puertos configurados:" -ForegroundColor Cyan
Write-Host "   🔐 Auth Service: http://localhost:5001" -ForegroundColor White
Write-Host "   📊 Swagger: http://localhost:5001/swagger" -ForegroundColor White
Write-Host "   🗄️ SQL Server: localhost:14400" -ForegroundColor White
Write-Host ""
Write-Host "📚 Comandos útiles:" -ForegroundColor Yellow
Write-Host "   .\scripts\manage-environments.ps1 dev    # Desarrollo local" -ForegroundColor White
Write-Host "   .\scripts\manage-environments.ps1 docker # Docker" -ForegroundColor White
Write-Host "   .\scripts\manage-environments.ps1 prod   # Producción" -ForegroundColor White
Write-Host "   .\scripts\manage-environments.ps1 show   # Ver configuración actual" -ForegroundColor White 