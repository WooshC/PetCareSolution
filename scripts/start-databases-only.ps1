# Script para iniciar solo las bases de datos de PetCare
# Útil para verificar que las bases de datos estén funcionando antes de iniciar los servicios

Write-Host "🐾 Iniciando solo las bases de datos de PetCare..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Detener todos los servicios si están corriendo
Write-Host "🛑 Deteniendo servicios existentes..." -ForegroundColor Yellow
docker-compose down

# Iniciar solo las bases de datos
Write-Host "🚀 Iniciando bases de datos..." -ForegroundColor Green
docker-compose up -d db-auth db-cuidador

# Esperar un momento para que las bases de datos se inicialicen
Write-Host "⏳ Esperando que las bases de datos se inicialicen..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar estado de los contenedores
Write-Host "📊 Verificando estado de los contenedores..." -ForegroundColor Blue
docker-compose ps db-auth db-cuidador

# Verificar logs de las bases de datos
Write-Host "`n📋 Logs de Auth Database:" -ForegroundColor Cyan
docker-compose logs db-auth

Write-Host "`n📋 Logs de Cuidador Database:" -ForegroundColor Cyan
docker-compose logs db-cuidador

# Verificar conectividad
Write-Host "`n🔗 Verificando conectividad..." -ForegroundColor Green

# Probar conexión a Auth DB
Write-Host "   Auth DB (localhost:14400):" -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "http://localhost:14400" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Auth DB accesible" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Auth DB no accesible: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar conexión a Cuidador DB
Write-Host "   Cuidador DB (localhost:14405):" -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "http://localhost:14405" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Cuidador DB accesible" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Cuidador DB no accesible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Script completado" -ForegroundColor Cyan
Write-Host "📝 Ahora puedes iniciar los servicios con: docker-compose up -d" -ForegroundColor Yellow 