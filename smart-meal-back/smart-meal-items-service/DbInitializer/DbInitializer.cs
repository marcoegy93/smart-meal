using Dapper;
using smart_meal_items_service.Utils;
using System.Text.RegularExpressions;

namespace smart_meal_items_service.DbInitializer;

public static class DbInitializer
{
    public static async Task InitializeDatabase(DapperDBContext dbContext)
    {
        try
        {
            await CreateDatabase(dbContext);

            using (var connection = dbContext.CreateConnection())
            { 
                // Vérifier si la base de données est initialisée
                string checkScript = await File.ReadAllTextAsync("Scripts/CheckDatabase.sql");
                var result = await connection.ExecuteScalarAsync<int>(checkScript);

                if (result == 0)
                {
                    string initScript = await File.ReadAllTextAsync("Scripts/DbInitializer.sql");

                    // Séparer les requêtes SQL sur "GO" en ignorant la casse et les espaces
                    var sqlStatements = Regex.Split(initScript, @"^\s*GO\s*$", RegexOptions.Multiline | RegexOptions.IgnoreCase);

                    foreach (var statement in sqlStatements)
                    {
                        if (!string.IsNullOrWhiteSpace(statement))
                        {
                            await connection.ExecuteAsync(statement);
                        }
                    }

                    Console.WriteLine("Base de données initialisée avec succès.");
                }
                else
                {
                    Console.WriteLine("Base de données déjà initialisée, pas besoin de réexécuter le script.");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur lors de l'initialisation de la BDD: {ex.Message}");
            throw;
        }
    }

    private static async Task CreateDatabase(DapperDBContext dbContext)
    {
        var connectionString =
            "Server=192.168.49.2,31433;Database=master;User Id=sa;Password={DB_PASSWORD};TrustServerCertificate=True;";
        var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD_SMART_MEAL");
        if (!string.IsNullOrEmpty(dbPassword))
        {
            connectionString = connectionString.Replace("{DB_PASSWORD}", dbPassword);
        }
        using (var connection = dbContext.CreateConnection(connectionString))
        {
            // Exécuter le script de création de la base de données si elle n'existe pas
            string createDatabaseScript = await File.ReadAllTextAsync("Scripts/CreateDatabase.sql");
            await connection.ExecuteAsync(createDatabaseScript);
        }
    }
}