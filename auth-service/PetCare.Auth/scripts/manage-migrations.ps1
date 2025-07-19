# Script para gestionar migraciones de PetCare.Auth
# Uso: .\manage-migrations.ps1 [comando]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("add", "update", "remove", "list", "script")]
    [string]$Command,
    
    [Parameter(Mandatory=$false)]
    [string]$MigrationName
)

Write-Host "🔧 Gestor de Migraciones - PetCare.Auth" -ForegroundColor Cyan
Write-Host ""

switch ($Command) {
    "add" {
        if ([string]::IsNullOrEmpty($MigrationName)) {
            Write-Host "❌ Error: Debe especificar un nombre para la migración" -ForegroundColor Red
            Write-Host "Uso: .\manage-migrations.ps1 add NombreMigracion" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "📝 Creando migración: $MigrationName" -ForegroundColor Green
        dotnet ef migrations add $MigrationName
        Write-Host "✅ Migración creada exitosamente" -ForegroundColor Green
    }
    
    "update" {
        Write-Host "🔄 Aplicando migraciones pendientes..." -ForegroundColor Green
        dotnet ef database update
        Write-Host "✅ Migraciones aplicadas exitosamente" -ForegroundColor Green
    }
    
    "remove" {
        Write-Host "🗑️ Removiendo última migración..." -ForegroundColor Yellow
        dotnet ef migrations remove
        Write-Host "✅ Última migración removida" -ForegroundColor Green
    }
    
    "list" {
        Write-Host "📋 Listando migraciones..." -ForegroundColor Green
        dotnet ef migrations list
    }
    
    "script" {
        Write-Host "📄 Generando script SQL..." -ForegroundColor Green
        dotnet ef migrations script
    }
}

Write-Host ""
Write-Host "🎉 Operación completada" -ForegroundColor Cyan 