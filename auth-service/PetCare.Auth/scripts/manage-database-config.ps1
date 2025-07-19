# Script para gestionar la configuración de base de datos de PetCare.Auth
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("show", "update", "backup", "validate")]
    [string]$Command,
    
    [Parameter(Mandatory=$false)]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [string]$ConnectionString
)

Write-Host "Gestor de Configuracion de Base de Datos - PetCare.Auth" -ForegroundColor Cyan

$configPath = "config\database.json"

if (-not (Test-Path $configPath)) {
    Write-Host "Error: Archivo de configuracion no encontrado en $configPath" -ForegroundColor Red
    exit 1
}

switch ($Command) {
    "show" {
        Write-Host "Configuracion actual de base de datos:" -ForegroundColor Green
        $config = Get-Content $configPath | ConvertFrom-Json
        
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
    }
    
    "update" {
        if ([string]::IsNullOrEmpty($Environment) -or [string]::IsNullOrEmpty($ConnectionString)) {
            Write-Host "Error: Debe especificar Environment y ConnectionString" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "Actualizando configuracion para entorno: $Environment" -ForegroundColor Green
        
        $config = Get-Content $configPath | ConvertFrom-Json
        $config.ConnectionStrings.$Environment = $ConnectionString
        
        $backupPath = "config\database.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
        $config | ConvertTo-Json -Depth 10 | Set-Content $backupPath
        Write-Host "Backup creado en: $backupPath" -ForegroundColor Yellow
        
        $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
        Write-Host "Configuracion actualizada exitosamente" -ForegroundColor Green
    }
    
    "backup" {
        $backupPath = "config\database.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
        Copy-Item $configPath $backupPath
        Write-Host "Backup creado en: $backupPath" -ForegroundColor Green
    }
    
    "validate" {
        Write-Host "Validando configuracion de base de datos..." -ForegroundColor Green
        
        try {
            $config = Get-Content $configPath | ConvertFrom-Json
            $requiredEnvironments = @("Default", "Development", "Testing", "Production")
            $missingEnvironments = @()
            
            foreach ($env in $requiredEnvironments) {
                if ([string]::IsNullOrEmpty($config.ConnectionStrings.$env)) {
                    $missingEnvironments += $env
                }
            }
            
            if ($missingEnvironments.Count -gt 0) {
                Write-Host "Entornos faltantes: $($missingEnvironments -join ', ')" -ForegroundColor Red
            } else {
                Write-Host "Todas las connection strings estan configuradas" -ForegroundColor Green
            }
            
            $validConnections = 0
            foreach ($env in $requiredEnvironments) {
                $conn = $config.ConnectionStrings.$env
                if ($conn -match "Server=.*;Database=.*;") {
                    $validConnections++
                } else {
                    Write-Host "Connection string para $env no tiene formato valido" -ForegroundColor Yellow
                }
            }
            
            Write-Host "$validConnections de $($requiredEnvironments.Count) connection strings tienen formato valido" -ForegroundColor Green
            
        } catch {
            Write-Host "Error al validar configuracion: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "Operacion completada" -ForegroundColor Cyan 