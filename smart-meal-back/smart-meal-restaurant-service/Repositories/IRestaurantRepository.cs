using smart_meal_restaurant_service.Contracts;
using smart_meal_restaurant_service.Models;

namespace smart_meal_restaurant_service.Repositories;

public interface IRestaurantRepository
{
    int UpdateRestaurantAndAccounts(Restaurant restaurant);
    int CreateRestaurantAndAccounts(Restaurant restaurant);
    UserModel? UserAuthentification(UserAuthentification userAuth);
    RestaurantModel? GetRestaurantById(int restaurantId);
    List<RestaurantModel> GetAllRestaurants();
    List<SalesAndRevenueModel> SalesAndRevenue(int restaurantId, string fromDate);

}

