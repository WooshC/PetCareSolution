# Script para configurar Docker para PetCare.Auth
Write-Host "🐳 Configurando Docker para PetCare.Auth..." -ForegroundColor Cyan

# Verificar que Docker esté instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Docker no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Verificar que Docker Compose esté disponible
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Docker Compose no está instalado" -ForegroundColor Red
    exit 1
}

# Crear configuración de Docker si no existe
$dockerConfigPath = "config\database.docker.json"
if (-not (Test-Path $dockerConfigPath)) {
    Write-Host "📝 Creando configuración de Docker..." -ForegroundColor Green
    
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
    
    $dockerConfig | ConvertTo-Json -Depth 10 | Set-Content $dockerConfigPath
    Write-Host "✅ Configuración de Docker creada" -ForegroundColor Green
}

# Construir y ejecutar contenedores
Write-Host "🔨 Construyendo contenedores..." -ForegroundColor Green
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir contenedores" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Iniciando servicios..." -ForegroundColor Green
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al iniciar servicios" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Docker configurado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Servicios disponibles:" -ForegroundColor Cyan
Write-Host "   🔐 Auth Service: http://localhost:5042" -ForegroundColor White
Write-Host "   📊 Swagger: http://localhost:5042/swagger" -ForegroundColor White
Write-Host "   🗄️ SQL Server: localhost:14433" -ForegroundColor White
Write-Host ""
Write-Host "📋 Comandos útiles:" -ForegroundColor Yellow
Write-Host "   Ver logs: docker-compose logs -f petcare-auth" -ForegroundColor White
Write-Host "   Detener: docker-compose down" -ForegroundColor White
Write-Host "   Reiniciar: docker-compose restart" -ForegroundColor White 