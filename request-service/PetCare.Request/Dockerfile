FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PetCare.Request.csproj", "./"]
RUN dotnet restore "PetCare.Request.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "PetCare.Request.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PetCare.Request.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PetCare.Request.dll"] 