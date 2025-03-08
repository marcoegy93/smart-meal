using smart_meal_restaurant_service.Models;
using System.Text.Json.Serialization;

namespace smart_meal_restaurant_service.Contracts;

public class RestaurantInfos
{
    public int? RestaurantId { get; set; }
    public string Name { get; set; }
    public string? Illustration { get; set; }
    public string Address { get; set; }
    public string? Siret { get; set; }
    public string? Tva { get; set; }
    public bool? IsVisible { get; set; }
    
    public int? AveragePrice { get; set; }

    public RestaurantInfos(RestaurantModel restaurant)
    {
        RestaurantId = restaurant.RestaurantId;
        Name = restaurant.Name;
        Illustration = restaurant.Illustration;
        Address = restaurant.Address;
        Siret = restaurant.Siret;
        Tva = restaurant.Tva;
        IsVisible = restaurant.IsVisible;
        AveragePrice = restaurant.AveragePrice;
    }

    [JsonConstructor]
    public RestaurantInfos(
        int? restaurantId,
        string name,
        string? illustration,
        string address,
        string? siret,
        string? tva,
        int? averagePrice)
    {
        RestaurantId = restaurantId;
        Name = name;
        Illustration = illustration;
        Address = address;
        Siret = siret;
        Tva = tva;
        AveragePrice = averagePrice;
    }

    public static explicit operator RestaurantInfos(RestaurantModel restaurant) => new(restaurant);
}
