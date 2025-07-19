# Script de inicialización para PetCare.Auth
# Este script configura el proyecto y aplica las migraciones

Write-Host "🚀 Inicializando PetCare.Auth..." -ForegroundColor Cyan
Write-Host ""

# Verificar y configurar archivo de base de datos
$databaseConfigPath = "config\database.json"
$databaseExamplePath = "config\database.example.json"

if (-not (Test-Path $databaseConfigPath)) {
    if (Test-Path $databaseExamplePath) {
        Write-Host "📝 Configurando archivo de base de datos..." -ForegroundColor Green
        Copy-Item $databaseExamplePath $databaseConfigPath
        Write-Host "⚠️ IMPORTANTE: Edita el archivo $databaseConfigPath con tus credenciales de base de datos" -ForegroundColor Yellow
        Write-Host "   Luego ejecuta: .\scripts\manage-database-config.ps1 validate" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: No se encontró el archivo de ejemplo de configuración" -ForegroundColor Red
        exit 1
    }
}

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "PetCare.Auth.csproj")) {
    Write-Host "❌ Error: Debe ejecutar este script desde el directorio del proyecto" -ForegroundColor Red
    exit 1
}

# Restaurar dependencias
Write-Host "📦 Restaurando dependencias..." -ForegroundColor Green
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al restaurar dependencias" -ForegroundColor Red
    exit 1
}

# Compilar proyecto
Write-Host "🔨 Compilando proyecto..." -ForegroundColor Green
dotnet build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar el proyecto" -ForegroundColor Red
    exit 1
}

# Aplicar migraciones
Write-Host "🔄 Aplicando migraciones..." -ForegroundColor Green
dotnet ef database update
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al aplicar migraciones" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Inicialización completada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Configurar la cadena de conexión en appsettings.json" -ForegroundColor White
Write-Host "   2. Ejecutar: dotnet run" -ForegroundColor White
Write-Host "   3. Acceder a: http://localhost:5042/swagger" -ForegroundColor White
Write-Host ""
Write-Host "📚 Para más información, consulta el README.md" -ForegroundColor Yellow 