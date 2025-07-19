# Script de inicio rápido para PetCare
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "docker")]
    [string]$Mode = "dev"
)

Write-Host "🚀 Inicio Rápido - PetCare" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ Error: Debe ejecutar este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Verificar que Docker esté instalado si se va a usar
if ($Mode -eq "docker") {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Error: Docker no está instalado para el modo Docker" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔧 Configurando entorno: $Mode" -ForegroundColor Green

# Configurar el entorno
& ".\scripts\manage-environments.ps1" $Mode

Write-Host ""
Write-Host "🎯 Iniciando servicios..." -ForegroundColor Green

switch ($Mode) {
    "dev" {
        Write-Host "🖥️ Iniciando en modo DESARROLLO LOCAL..." -ForegroundColor Green
        
        # Navegar al auth service y ejecutar
        Set-Location "auth-service/PetCare.Auth"
        
        Write-Host "📦 Restaurando dependencias..." -ForegroundColor Yellow
        dotnet restore
        
        Write-Host "🔨 Compilando proyecto..." -ForegroundColor Yellow
        dotnet build
        
        Write-Host "🔄 Aplicando migraciones..." -ForegroundColor Yellow
        dotnet ef database update
        
        Write-Host "🚀 Iniciando aplicación..." -ForegroundColor Green
        Write-Host "📍 Swagger disponible en: http://localhost:5001/swagger" -ForegroundColor Cyan
        Write-Host "⏹️ Para detener: Ctrl+C" -ForegroundColor Yellow
        
        dotnet run
    }
    
    "docker" {
        Write-Host "🐳 Iniciando en modo DOCKER..." -ForegroundColor Green
        
        # Volver a la raíz
        Set-Location $PSScriptRoot/..
        
        Write-Host "🔨 Construyendo contenedores..." -ForegroundColor Yellow
        docker-compose build
        
        Write-Host "🚀 Iniciando servicios..." -ForegroundColor Yellow
        docker-compose up -d
        
        Write-Host ""
        Write-Host "✅ Servicios iniciados exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎯 Servicios disponibles:" -ForegroundColor Cyan
        Write-Host "   🔐 Auth Service: http://localhost:5001" -ForegroundColor White
        Write-Host "   📊 Swagger: http://localhost:5001/swagger" -ForegroundColor White
        Write-Host "   🗄️ SQL Server: localhost:14400" -ForegroundColor White
        Write-Host ""
        Write-Host "📋 Comandos útiles:" -ForegroundColor Yellow
        Write-Host "   Ver logs: docker-compose logs -f petcare-auth" -ForegroundColor White
        Write-Host "   Detener: docker-compose down" -ForegroundColor White
        Write-Host "   Reiniciar: docker-compose restart" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "🎉 ¡PetCare está listo!" -ForegroundColor Green 