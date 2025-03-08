using smart_meal_restaurant_service.Models;

namespace smart_meal_restaurant_service.Contracts;

public class User
{

    public User(UserModel user)
    {
        AdministratorId = user.AdministratorId;
        RestaurantId = user.RestaurantId;
        RestaurantName = user.RestaurantName;
        RestaurantAddress = user.RestaurantAddress;
        FirstName = user.FirstName;
        LastName = user.LastName;
        Email = user.Email;
        Phone = user.Phone;
        Illustration = user.Illustration;
        Role = user.Role;    
        RestaurantPicture = user.RestaurantPicture;
        RestaurantSiret = user.RestaurantSiret;
        RestaurantTva = user.RestaurantTva;
    }

    public int AdministratorId { get; set; }
    public int RestaurantId { get; set; }
    public string RestaurantName { get; set; }
    public string RestaurantAddress { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Illustration { get; set; }
    public string? RestaurantPicture { get; set; }
    public string? RestaurantSiret { get; set; }
    public string? RestaurantTva { get; set; }
    public string Role { get; set; }

    public static explicit operator User(UserModel user) => new(user);
}
