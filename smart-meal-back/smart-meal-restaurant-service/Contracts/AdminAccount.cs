namespace smart_meal_restaurant_service.Contracts;

public class AdminAccount
{
    public int? AdministratorId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? illustration { get; set; }
    public string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Password { get; set; }
}
