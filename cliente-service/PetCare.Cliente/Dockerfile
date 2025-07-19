FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PetCare.Cliente.csproj", "."]
RUN dotnet restore "PetCare.Cliente.csproj"
COPY . .
RUN dotnet publish "PetCare.Cliente.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "PetCare.Cliente.dll"] 