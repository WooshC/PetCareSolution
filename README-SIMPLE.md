# PetCare - Simple Setup 🐾

Sistema de autenticación simple para PetCare.

## 🚀 Inicio Rápido

### Desarrollo Local
```bash
# 1. Tener SQL Server corriendo en localhost:1433
#    Usuario: sa, Contraseña: admin1234

# 2. Ejecutar aplicación
cd auth-service/PetCare.Auth
dotnet run

# 3. Abrir Swagger
# http://localhost:5001/swagger
```

### Docker
```bash
# 1. Ejecutar todo con Docker
docker-compose up -d

# 2. Abrir Swagger
# http://localhost:5001/swagger
```

## 📋 Configuración

### Local
- **Archivo**: `auth-service/PetCare.Auth/appsettings.json`
- **Conexión**: `Server=localhost,1433;Database=PetCareAuth;User Id=sa;Password=admin1234;TrustServerCertificate=true;`

### Docker
- **Archivo**: `auth-service/PetCare.Auth/appsettings.Docker.json`
- **Conexión**: `Server=db;Database=PetCareAuth;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;`

## 🎯 Endpoints

- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios
- `GET /api/auth/users` - Listar usuarios (desarrollo)
- `GET /api/auth/me` - Usuario actual

## 🐳 Puertos Docker

- **Auth Service**: http://localhost:5001
- **SQL Server**: localhost:14400
- **Swagger**: http://localhost:5001/swagger

## 🔧 Comandos Útiles

```bash
# Aplicar migraciones
dotnet ef database update

# Crear migración
dotnet ef migrations add NombreMigracion

# Ver logs Docker
docker-compose logs -f petcare-auth

# Detener Docker
docker-compose down
```

---

**¡Listo para usar!** 🎉 