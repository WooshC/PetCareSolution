# PetCare Database Management Script
# Script para gestionar las bases de datos separadas de PetCare Solution

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart", "logs", "connect-auth", "connect-cuidador", "backup", "restore")]
    [string]$Action = "start",
    
    [Parameter(Mandatory=$false)]
    [string]$BackupPath = ".\backups"
)

Write-Host "🐾 PetCare Database Management Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

function Start-Databases {
    Write-Host "🚀 Iniciando bases de datos de PetCare..." -ForegroundColor Green
    docker-compose up -d db-auth db-cuidador
    Write-Host "✅ Bases de datos iniciadas" -ForegroundColor Green
    Write-Host "   Auth DB: localhost:14400 (petcare-auth-db)" -ForegroundColor Yellow
    Write-Host "   Cuidador DB: localhost:14405 (petcare-cuidador-db)" -ForegroundColor Yellow
}

function Stop-Databases {
    Write-Host "🛑 Deteniendo bases de datos de PetCare..." -ForegroundColor Red
    docker-compose stop db-auth db-cuidador
    Write-Host "✅ Bases de datos detenidas" -ForegroundColor Green
}

function Restart-Databases {
    Write-Host "🔄 Reiniciando bases de datos de PetCare..." -ForegroundColor Yellow
    Stop-Databases
    Start-Sleep -Seconds 3
    Start-Databases
}

function Show-Logs {
    Write-Host "📋 Mostrando logs de las bases de datos..." -ForegroundColor Blue
    Write-Host "Auth Database Logs:" -ForegroundColor Cyan
    docker-compose logs db-auth
    Write-Host "`nCuidador Database Logs:" -ForegroundColor Cyan
    docker-compose logs db-cuidador
}

function Connect-AuthDB {
    Write-Host "🔗 Conectando a Auth Database..." -ForegroundColor Green
    Write-Host "Server: localhost,14400" -ForegroundColor Yellow
    Write-Host "Database: PetCareAuth" -ForegroundColor Yellow
    Write-Host "User: sa" -ForegroundColor Yellow
    Write-Host "Password: YourStrong@Passw0rd" -ForegroundColor Yellow
    
    $connectionString = "Server=localhost,14400;Database=PetCareAuth;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
    Write-Host "`nConnection String:" -ForegroundColor Cyan
    Write-Host $connectionString -ForegroundColor Gray
}

function Connect-CuidadorDB {
    Write-Host "🔗 Conectando a Cuidador Database..." -ForegroundColor Green
    Write-Host "Server: localhost,14405" -ForegroundColor Yellow
    Write-Host "Database: PetCareCuidador" -ForegroundColor Yellow
    Write-Host "User: sa" -ForegroundColor Yellow
    Write-Host "Password: YourStrong@Passw0rd" -ForegroundColor Yellow
    
    $connectionString = "Server=localhost,14405;Database=PetCareCuidador;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
    Write-Host "`nConnection String:" -ForegroundColor Cyan
    Write-Host $connectionString -ForegroundColor Gray
}

function Backup-Databases {
    Write-Host "💾 Creando backup de las bases de datos..." -ForegroundColor Green
    
    if (!(Test-Path $BackupPath)) {
        New-Item -ItemType Directory -Path $BackupPath -Force
    }
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    
    # Backup Auth Database
    Write-Host "📦 Backup Auth Database..." -ForegroundColor Yellow
    $authBackupFile = "$BackupPath\PetCareAuth_$timestamp.bak"
    docker exec db-auth /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -Q "BACKUP DATABASE PetCareAuth TO DISK = '/var/opt/mssql/backup.bak'"
    docker cp db-auth:/var/opt/mssql/backup.bak $authBackupFile
    Write-Host "✅ Auth backup creado: $authBackupFile" -ForegroundColor Green
    
    # Backup Cuidador Database
    Write-Host "📦 Backup Cuidador Database..." -ForegroundColor Yellow
    $cuidadorBackupFile = "$BackupPath\PetCareCuidador_$timestamp.bak"
    docker exec db-cuidador /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -Q "BACKUP DATABASE PetCareCuidador TO DISK = '/var/opt/mssql/backup.bak'"
    docker cp db-cuidador:/var/opt/mssql/backup.bak $cuidadorBackupFile
    Write-Host "✅ Cuidador backup creado: $cuidadorBackupFile" -ForegroundColor Green
}

function Show-Status {
    Write-Host "📊 Estado de las bases de datos:" -ForegroundColor Cyan
    docker-compose ps db-auth db-cuidador
    Write-Host "`n📋 Nombres de contenedores:" -ForegroundColor Yellow
    Write-Host "   Auth DB: petcare-auth-db" -ForegroundColor Gray
    Write-Host "   Cuidador DB: petcare-cuidador-db" -ForegroundColor Gray
    Write-Host "   Auth Service: petcare-auth-service" -ForegroundColor Gray
    Write-Host "   Cuidador Service: petcare-cuidador-service" -ForegroundColor Gray
}

# Ejecutar acción según parámetro
switch ($Action) {
    "start" { Start-Databases }
    "stop" { Stop-Databases }
    "restart" { Restart-Databases }
    "logs" { Show-Logs }
    "connect-auth" { Connect-AuthDB }
    "connect-cuidador" { Connect-CuidadorDB }
    "backup" { Backup-Databases }
    "status" { Show-Status }
    default {
        Write-Host "❌ Acción no válida. Acciones disponibles:" -ForegroundColor Red
        Write-Host "   start - Iniciar bases de datos" -ForegroundColor Yellow
        Write-Host "   stop - Detener bases de datos" -ForegroundColor Yellow
        Write-Host "   restart - Reiniciar bases de datos" -ForegroundColor Yellow
        Write-Host "   logs - Mostrar logs" -ForegroundColor Yellow
        Write-Host "   connect-auth - Conectar a Auth DB" -ForegroundColor Yellow
        Write-Host "   connect-cuidador - Conectar a Cuidador DB" -ForegroundColor Yellow
        Write-Host "   backup - Crear backup" -ForegroundColor Yellow
        Write-Host "   status - Mostrar estado" -ForegroundColor Yellow
    }
}

Write-Host "`n🐾 Script completado" -ForegroundColor Cyan 