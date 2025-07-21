FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos del proyecto
COPY ["PetCare.Chat.csproj", "./"]
RUN dotnet restore "PetCare.Chat.csproj"

COPY . .
RUN dotnet build "PetCare.Chat.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PetCare.Chat.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "PetCare.Chat.dll"] 