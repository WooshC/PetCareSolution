FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos del proyecto
COPY ["PetCare.Auth.csproj", "./"]
RUN dotnet restore "PetCare.Auth.csproj"

COPY . .
RUN dotnet build "PetCare.Auth.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PetCare.Auth.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Crear directorio para configuración externa
RUN mkdir -p /app/config

# Script de inicialización
COPY ["scripts/wait-for-db.sh", "/app/"]
RUN chmod +x /app/wait-for-db.sh

ENTRYPOINT ["dotnet", "PetCare.Auth.dll"] 