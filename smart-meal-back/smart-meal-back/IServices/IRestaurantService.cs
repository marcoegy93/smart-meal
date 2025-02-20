using smart_meal_back.Contracts;
using smart_meal_back.Models;

namespace smart_meal_back.IServices;

public interface IRestaurantService
{
    int CreateOrUpdateRestaurantAndAccounts(Restaurant restaurant);
    List<RestaurantModel> GetAllRestaurants();
    RestaurantModel? GetRestaurantById(int restaurantId);
    UserTokenModel? UserAuthentification(UserAuthentification userAuth);
    List<SalesAndRevenueModel> SalesAndRevenue(int restaurantId, string fromDate);
}
