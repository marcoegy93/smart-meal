using smart_meal_restaurant_service.Contracts;

namespace smart_meal_restaurant_service.Models;

public class UserTokenModel
{
    public string Token { get; set; }
    public UserModel User { get; set; }

}
