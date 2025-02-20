namespace smart_meal_back.Models;

public class RestaurantModel
{
    public int RestaurantId { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string Siret { get; set; }
    public string Illustration { get; set; }
    public string Tva { get; set; }
    public bool IsVisible { get; set; }
    public int AveragePrice { get; set; }
}
