﻿using Dapper;
using smart_meal_orders_service.Utils;
using System.Text.RegularExpressions;

namespace smart_meal_orders_service.DbInitializer;

public static class DbInitializer
{
    public static async Task InitializeDatabase(DapperDBContext dbContext)
    {
        try
        {
            using (var connection = dbContext.CreateConnection())
            {
                // Exécuter le script de création de la base de données si elle n'existe pas
                string createDatabaseScript = await File.ReadAllTextAsync("Scripts/CreateDatabase.sql");
                await connection.ExecuteAsync(createDatabaseScript);

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
}