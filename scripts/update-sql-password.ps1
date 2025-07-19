# Script para actualizar la contraseña de SQL Server
param(
    [Parameter(Mandatory=$true)]
    [string]$Password
)

Write-Host "🔧 Actualizando contraseña de SQL Server..." -ForegroundColor Cyan
Write-Host ""

$authServicePath = "auth-service/PetCare.Auth"
$configPath = "$authServicePath/config/database.json"
$appSettingsPath = "$authServicePath/appsettings.json"

# Verificar que existe el archivo de configuración
if (-not (Test-Path $configPath)) {
    Write-Host "❌ Error: No se encontró el archivo de configuración" -ForegroundColor Red
    exit 1
}

try {
    # Leer configuración actual
    $config = Get-Content $configPath | ConvertFrom-Json
    
    # Actualizar connection strings con la nueva contraseña
    $config.ConnectionStrings.Default = $config.ConnectionStrings.Default -replace "Password=[^;]+", "Password=$Password"
    $config.ConnectionStrings.Development = $config.ConnectionStrings.Development -replace "Password=[^;]+", "Password=$Password"
    $config.ConnectionStrings.Testing = $config.ConnectionStrings.Testing -replace "Password=[^;]+", "Password=$Password"
    
    # Guardar configuración actualizada
    $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
    
    Write-Host "✅ Configuración de database.json actualizada" -ForegroundColor Green
    
    # También actualizar appsettings.json si existe
    if (Test-Path $appSettingsPath) {
        $appSettings = Get-Content $appSettingsPath | ConvertFrom-Json
        $appSettings.ConnectionStrings.Default = $appSettings.ConnectionStrings.Default -replace "Password=[^;]+", "Password=$Password"
        $appSettings | ConvertTo-Json -Depth 10 | Set-Content $appSettingsPath
        
        Write-Host "✅ appsettings.json actualizado" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🎯 Configuración actualizada exitosamente!" -ForegroundColor Green
    Write-Host "📝 Contraseña actualizada en:" -ForegroundColor Yellow
    Write-Host "   - $configPath" -ForegroundColor White
    Write-Host "   - $appSettingsPath" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Ahora puedes ejecutar: dotnet run" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error al actualizar la configuración: $($_.Exception.Message)" -ForegroundColor Red
} 