using smart_meal_restaurant_service.Contracts;
using smart_meal_restaurant_service.Models;

namespace smart_meal_restaurant_service.Services;

public interface IRestaurantService
{
    int CreateOrUpdateRestaurantAndAccounts(Restaurant restaurant);
    List<RestaurantModel> GetAllRestaurants();
    RestaurantModel? GetRestaurantById(int restaurantId);
    UserTokenModel? UserAuthentification(UserAuthentification userAuth);
    List<SalesAndRevenueModel> SalesAndRevenue(int restaurantId, string fromDate);
}
