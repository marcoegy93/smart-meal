FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 7174

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["smart-meal-restaurant-service/smart-meal-restaurant-service.csproj", "smart-meal-restaurant-service/"]
RUN dotnet restore "./smart-meal-restaurant-service/./smart-meal-restaurant-service.csproj"
COPY . .
WORKDIR "/src/smart-meal-restaurant-service"
RUN dotnet build "./smart-meal-restaurant-service.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./smart-meal-restaurant-service.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "smart-meal-restaurant-service.dll"]