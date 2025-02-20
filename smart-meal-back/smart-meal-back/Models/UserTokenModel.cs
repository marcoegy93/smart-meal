using smart_meal_back.Contracts;

namespace smart_meal_back.Models;

public class UserTokenModel
{
    public string Token { get; set; }
    public UserModel User { get; set; }

}
