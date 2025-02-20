using smart_meal_back.Contracts;
using smart_meal_back.Models;

namespace smart_meal_back.IRepositories;

public interface IRestaurantRepository
{
    int UpdateRestaurantAndAccounts(Restaurant restaurant);
    int CreateRestaurantAndAccounts(Restaurant restaurant);
    UserModel? UserAuthentification(UserAuthentification userAuth);
    RestaurantModel? GetRestaurantById(int restaurantId);
    List<RestaurantModel> GetAllRestaurants();
    List<SalesAndRevenueModel> SalesAndRevenue(int restaurantId, string fromDate);

}

