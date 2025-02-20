# Utilise l'image officielle .NET SDK pour construire l'application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Défini le répertoire de travail dans l'image
WORKDIR /app

# Copie le fichier .csproj dans le répertoire de travail de l'image et restaure les dépendances
COPY smart-meal-back/smart-meal-back.csproj ./
RUN dotnet restore

# Copie le reste des fichiers nécessaires pour la construction du projet
COPY smart-meal-back/ ./

# Construit l'application en mode Release et la publie dans le répertoire out
RUN dotnet publish -c Release -o out

# Utilise l'image officielle .NET Runtime pour exécuter l'application
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

# Copie l'application publiée du conteneur de build vers le conteneur de runtime
COPY --from=build /app/out ./

EXPOSE 7172

# Défini le point d'entrée de l'application
ENTRYPOINT ["dotnet", "smart-meal-back.dll"]