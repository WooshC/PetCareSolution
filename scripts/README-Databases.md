# 🗄️ Gestión de Bases de Datos PetCare

Documentación para la gestión de las bases de datos separadas de PetCare Solution

## 📋 Arquitectura de Bases de Datos

PetCare Solution utiliza una arquitectura de microservicios con **bases de datos separadas** por servicio:

### 🏗️ Estructura Actual

```
PetCare Solution
├── Auth Service
│   ├── Base de Datos: PetCareAuth
│   ├── Puerto: 14400
│   └── Contenedor: db-auth
├── Cuidador Service
│   ├── Base de Datos: PetCareCuidador
│   ├── Puerto: 14405
│   └── Contenedor: db-cuidador
└── Servicios Futuros
    ├── Cliente Service (PetCareCliente)
    ├── Request Service (PetCareRequest)
    ├── Chat Service (PetCareChat)
    └── Rating Service (PetCareRating)
```

## 🚀 Configuración de Contenedores

### Docker Compose Services

```yaml
# Base de datos para Auth Service
db-auth:
  container_name: petcare-auth-db
  image: mcr.microsoft.com/mssql/server:2022-latest
  ports:
    - "14400:1433"
  volumes:
    - sql_auth_data:/var/opt/mssql

# Base de datos para Cuidador Service
db-cuidador:
  container_name: petcare-cuidador-db
  image: mcr.microsoft.com/mssql/server:2022-latest
  ports:
    - "14405:1433"
  volumes:
    - sql_cuidador_data:/var/opt/mssql
```

### Volúmenes de Datos

```yaml
volumes:
  sql_auth_data:      # Datos persistentes de Auth DB
  sql_cuidador_data:  # Datos persistentes de Cuidador DB
```

## 🔧 Script de Gestión

### Uso del Script PowerShell

```powershell
# Iniciar solo las bases de datos
.\scripts\manage-databases.ps1 start

# Detener bases de datos
.\scripts\manage-databases.ps1 stop

# Reiniciar bases de datos
.\scripts\manage-databases.ps1 restart

# Ver logs de las bases de datos
.\scripts\manage-databases.ps1 logs

# Conectar a Auth Database
.\scripts\manage-databases.ps1 connect-auth

# Conectar a Cuidador Database
.\scripts\manage-databases.ps1 connect-cuidador

# Crear backup de las bases de datos
.\scripts\manage-databases.ps1 backup

# Ver estado de los contenedores
.\scripts\manage-databases.ps1 status
```

## 📊 Información de Conexión

### Auth Service Database
- **Servidor:** `localhost:14400`
- **Base de datos:** `PetCareAuth`
- **Usuario:** `sa`
- **Contraseña:** `YourStrong@Passw0rd`
- **Connection String:**
  ```
  Server=localhost,14400;Database=PetCareAuth;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;
  ```

### Cuidador Service Database
- **Servidor:** `localhost:14405`
- **Base de datos:** `PetCareCuidador`
- **Usuario:** `sa`
- **Contraseña:** `YourStrong@Passw0rd`
- **Connection String:**
  ```
  Server=localhost,14405;Database=PetCareCuidador;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;
  ```

## 🛠️ Comandos Útiles

### Docker Compose
```bash
# Iniciar solo las bases de datos
docker-compose up -d db-auth db-cuidador

# Ver logs específicos
docker-compose logs -f db-auth
docker-compose logs -f db-cuidador

# Detener bases de datos
docker-compose stop db-auth db-cuidador

# Eliminar volúmenes (¡CUIDADO! Borra todos los datos)
docker-compose down -v
```

### SQL Server Management
```bash
# Conectar a Auth DB
sqlcmd -S localhost,14400 -U sa -P YourStrong@Passw0rd -d PetCareAuth

# Conectar a Cuidador DB
sqlcmd -S localhost,14405 -U sa -P YourStrong@Passw0rd -d PetCareCuidador

# Verificar conexión
sqlcmd -S localhost,14400 -U sa -P YourStrong@Passw0rd -Q "SELECT 1"
sqlcmd -S localhost,14405 -U sa -P YourStrong@Passw0rd -Q "SELECT 1"
```

## 💾 Backup y Restore

### Crear Backup
```powershell
# Usar script
.\scripts\manage-databases.ps1 backup

# Manual
docker exec db-auth /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -Q "BACKUP DATABASE PetCareAuth TO DISK = '/var/opt/mssql/backup.bak'"
docker cp db-auth:/var/opt/mssql/backup.bak ./backups/PetCareAuth_$(Get-Date -Format 'yyyyMMdd_HHmmss').bak
```

### Restaurar Backup
```bash
# Copiar archivo de backup al contenedor
docker cp ./backups/PetCareAuth_20250101_120000.bak db-auth:/var/opt/mssql/backup.bak

# Restaurar base de datos
docker exec db-auth /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -Q "RESTORE DATABASE PetCareAuth FROM DISK = '/var/opt/mssql/backup.bak'"
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Verificar puertos en uso
netstat -an | findstr "14400"
netstat -an | findstr "14405"

# Cambiar puertos en docker-compose.yml si es necesario
```

#### 2. Contenedor no inicia
```bash
# Ver logs del contenedor
docker-compose logs db-auth
docker-compose logs db-cuidador

# Verificar recursos del sistema
docker stats
```

#### 3. Error de conexión
```bash
# Verificar que los contenedores estén corriendo
docker-compose ps

# Probar conexión desde host
sqlcmd -S localhost,14400 -U sa -P YourStrong@Passw0rd -Q "SELECT 1"
```

#### 4. Datos perdidos
```bash
# Verificar volúmenes
docker volume ls

# Verificar contenido del volumen
docker run --rm -v petcaresolution_sql_auth_data:/data alpine ls -la /data
```

## 📈 Monitoreo

### Métricas de Rendimiento
```bash
# Ver uso de recursos
docker stats db-auth db-cuidador

# Ver logs en tiempo real
docker-compose logs -f db-auth db-cuidador
```

### Verificar Estado
```bash
# Estado de contenedores
docker-compose ps

# Verificar bases de datos
sqlcmd -S localhost,14400 -U sa -P YourStrong@Passw0rd -Q "SELECT name FROM sys.databases"
sqlcmd -S localhost,14405 -U sa -P YourStrong@Passw0rd -Q "SELECT name FROM sys.databases"
```

## 🔄 Migración de Datos

### De Base de Datos Única a Separadas

Si tienes una instalación anterior con una sola base de datos:

1. **Crear backup de la base de datos original**
2. **Iniciar las nuevas bases de datos separadas**
3. **Migrar datos específicos de cada servicio**
4. **Actualizar connection strings en los servicios**

### Script de Migración
```powershell
# Ejemplo de migración (ajustar según necesidades)
.\scripts\migrate-to-separate-dbs.ps1
```

## 📝 Notas Importantes

- **Separación de datos:** Cada servicio tiene su propia base de datos
- **Independencia:** Los servicios pueden evolucionar independientemente
- **Escalabilidad:** Cada base de datos puede escalar por separado
- **Backup independiente:** Cada base de datos se puede respaldar por separado
- **Puertos únicos:** Cada base de datos usa un puerto diferente para evitar conflictos

---

**¡Gracias por usar PetCare Database Management! 🗄️** 