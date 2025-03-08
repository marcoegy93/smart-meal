FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 7175

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["smart-meal-orders-service/smart-meal-orders-service.csproj", "smart-meal-orders-service/"]
RUN dotnet restore "./smart-meal-orders-service/./smart-meal-orders-service.csproj"
COPY . .
WORKDIR "/src/smart-meal-orders-service"
RUN dotnet build "./smart-meal-orders-service.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./smart-meal-orders-service.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "smart-meal-orders-service.dll"]