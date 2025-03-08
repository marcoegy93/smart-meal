using Dapper;
using System.Data;
using smart_meal_restaurant_service.Contracts;
using smart_meal_restaurant_service.Models;
using Microsoft.Data.SqlClient;
using smart_meal_restaurant_service.Utils;

namespace smart_meal_restaurant_service.Repositories;

public class RestaurantRepository: IRestaurantRepository
{
    private readonly DapperDBContext _dBContext;

    public RestaurantRepository(DapperDBContext dBContext)
    {
        _dBContext = dBContext;
    }

    public int UpdateRestaurantAndAccounts(Restaurant restaurant)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            return connection.QuerySingle<int>(
                 "UpdateRestaurantAndAccounts",
                 new
                 {
                     RestaurantId = restaurant.RestaurantId ?? (object)DBNull.Value,
                     restaurant.Name,
                     restaurant.Illustration,
                     restaurant.Address,
                     restaurant.Siret,
                     restaurant.Tva,
                     AdministratorId = restaurant.Admin.AdministratorId ?? (object)DBNull.Value,
                     restaurant.Admin.FirstName,
                     restaurant.Admin.LastName,
                     IllustrationAdmin = restaurant.Admin.illustration ?? (object)DBNull.Value,
                     restaurant.Admin.Email,
                     PhoneNumber = restaurant.Admin.PhoneNumber ?? (object)DBNull.Value,
                     Password = restaurant.Admin.Password ?? (object)DBNull.Value
                 },
                 commandType: CommandType.StoredProcedure
             );
        }
        catch (Exception e)
        {
            throw new Exception(e.ToString());
        }
    }

    public int CreateRestaurantAndAccounts(Restaurant restaurant)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            string BcryptMdp = BCrypt.Net.BCrypt.HashPassword(restaurant.Admin.Password, 10);

            return connection.QuerySingle<int>(
                "CreateRestaurantAndAccounts",
                new
                {
                    restaurant.Name,
                    restaurant.Illustration,
                    restaurant.Address,
                    restaurant.Siret,
                    restaurant.Tva,
                    AdministratorId = restaurant.Admin.AdministratorId ?? (object)DBNull.Value,
                    restaurant.Admin.FirstName,
                    restaurant.Admin.LastName,
                    IllustrationAdmin = restaurant.Admin.illustration ?? (object)DBNull.Value,
                    restaurant.Admin.Email,
                    PhoneNumber = restaurant.Admin.PhoneNumber ?? (object)DBNull.Value,
                    Password = BcryptMdp,
                    ContractUrl = restaurant.ContractUrl,
                    Payment_id = restaurant.PaymentId
                },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (SqlException ex) when (ex.Number == 50001)
        {
            throw new Exception("Cet email existe déjà.");
        }
        catch (Exception e)
        {
            throw new Exception(e.ToString());
        }
    }


    public UserModel? UserAuthentification(UserAuthentification userAuth)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            return connection.QueryFirstOrDefault<UserModel>(
                "UserAuthentification",
                new
                {
                    userAuth.Email
                },
                commandType: CommandType.StoredProcedure
            );
        }
        catch (Exception e)
        {
            throw new Exception(e.ToString());
        }
    }

    public RestaurantModel? GetRestaurantById(int restaurantId)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            return connection.QueryFirstOrDefault<RestaurantModel>(
                 "GetRestaurantById",
                 new { RestaurantId = restaurantId },
                 commandType: CommandType.StoredProcedure
             );
        }
        catch (Exception e)
        {
            throw new Exception(e.ToString());
        }
    }

    public List<RestaurantModel> GetAllRestaurants()
    {
        try
        {
            using var connection = _dBContext.CreateConnection();
            connection.Open();

            return connection.Query<RestaurantModel>(
                "GetAllRestaurants",
                commandType: CommandType.StoredProcedure
            ).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("Une erreur est survenue lors de la récupération des restaurants.", ex);
        }
    }

    public List<SalesAndRevenueModel> SalesAndRevenue(int restaurantId, string fromDate)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();
        try
        {
            return connection.Query<SalesAndRevenueModel>(
                 "GetSalesAndRevenueModel",
                 new { RestaurantId = restaurantId, FromDate = fromDate },
                 commandType: CommandType.StoredProcedure
             ).ToList();
        }
        catch (Exception e)
        {
            throw new Exception(e.ToString());
        }
    }

}
