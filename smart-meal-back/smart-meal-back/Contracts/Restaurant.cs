namespace smart_meal_back.Contracts;

public class Restaurant
{
    public int? RestaurantId { get; set; }
    public string Name { get; set; }
    public string? Illustration { get; set; }
    public string Address { get; set; }
    public string? Siret { get; set; }
    public string? Tva { get; set; }
    public AdminAccount Admin { get; set; }
    public string? PaymentId { get; set; }
    public string?  ContractUrl { get; set; }
}
