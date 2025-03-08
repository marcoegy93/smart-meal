﻿using smart_meal_restaurant_service.Utils;

namespace smart_meal_restaurant_service.DbInitializer;

public static class ApplicationExtensions
{
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DapperDBContext>();
        await DbInitializer.InitializeDatabase(dbContext);
    }
}
