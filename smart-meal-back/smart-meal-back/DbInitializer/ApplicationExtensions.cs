﻿using smart_meal_back.Repositories;

namespace smart_meal_back.DbInitializer
{
    public static class ApplicationExtensions
    {
        public static async Task InitializeDatabaseAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<DapperDBContext>();
            await DbInitializer.InitializeDatabase(dbContext);
        }
    }
}
