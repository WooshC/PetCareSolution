#!/bin/bash

# Script para esperar a que SQL Server esté listo
echo "🔄 Esperando a que SQL Server esté listo..."

# Instalar sqlcmd si no está disponible
if ! command -v sqlcmd &> /dev/null; then
    echo "📦 Instalando sqlcmd..."
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
    apt-get update
    ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
    export PATH="$PATH:/opt/mssql-tools/bin"
fi

# Variables de conexión
SERVER=${DB_SERVER:-db}
USER=${DB_USER:-sa}
PASSWORD=${DB_PASSWORD:-YourStrong@Passw0rd}
DATABASE=${DB_NAME:-PetCareAuth}

# Esperar hasta que SQL Server esté disponible
until /opt/mssql-tools/bin/sqlcmd -S $SERVER -U $USER -P $PASSWORD -Q "SELECT 1" &> /dev/null; do
    echo "⏳ SQL Server no está listo aún... esperando 5 segundos"
    sleep 5
done

echo "✅ SQL Server está listo!"

# Crear base de datos si no existe
echo "🔧 Verificando base de datos..."
/opt/mssql-tools/bin/sqlcmd -S $SERVER -U $USER -P $PASSWORD -Q "IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '$DATABASE') CREATE DATABASE [$DATABASE]"

echo "✅ Base de datos verificada!"

# Ejecutar la aplicación
echo "🚀 Iniciando aplicación..."
exec dotnet PetCare.Auth.dll 