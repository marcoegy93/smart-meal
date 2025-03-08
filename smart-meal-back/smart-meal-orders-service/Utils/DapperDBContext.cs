using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using System.Data;

namespace smart_meal_orders_service.Utils;

public class DapperDBContext
{
    private readonly string _connectionString;

    public DapperDBContext(IOptions<DatabaseOptions> options)
    {
        _connectionString = options.Value.DefaultConnection;
    }

    public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
    
    public IDbConnection CreateConnection(string connectionString) => new SqlConnection(connectionString);
}