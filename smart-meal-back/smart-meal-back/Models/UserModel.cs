namespace smart_meal_back.Models;

public class UserModel
{
    public int AdministratorId { get; set; } 
    public int RestaurantId { get; set; }
    public string RestaurantName { get; set; }
    public string RestaurantAddress { get; set; }
    public string FirstName { get; set; } 
    public string LastName { get; set; } 
    public string Email { get; set; } 
    public string Phone { get; set; }
    public string Illustration { get; set; }
    public string Role { get; set; }
    public string Password { get; set; }
    public string RestaurantPicture { get; set; }
    public string RestaurantSiret { get; set; }
    public string RestaurantTva { get; set; }
}
