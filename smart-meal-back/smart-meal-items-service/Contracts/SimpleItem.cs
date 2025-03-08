using Newtonsoft.Json;
using smart_meal_items_service.Enums;

namespace smart_meal_items_service.Contracts;

public class SimpleItem : AbsItem
{
    public int? RestaurantId { get; set; }
    public int Duration { get; set; }
    public double Price { get; set; }

    public ItemStatus Status { get; set; }
    public List<string>? Ingredients { get; set; }
    public List<string>? Keywords { get; set; }
    public List<string>? Categories { get; set; }
    public string? Description { get; set; }


    [JsonConstructor]
    public SimpleItem(int? itemId, int? restaurantId, string name, string illustration, ItemType type, int duration, double price, ItemStatus status, List<string>? ingredients, List<string>? keywords, List<string>? categories, string? description)
        : base(itemId, name, illustration, type)
    {
        RestaurantId = restaurantId;
        Duration = duration;
        Price = price;
        Status = status;
        Ingredients = ingredients;
        Keywords = keywords;
        Categories = categories;
        Description = description;
    }

    public SimpleItem(ItemModel item)
        : base(item.ItemId, item.Name, item.Illustration, item.Type)
    {
        RestaurantId = item.RestaurantId;
        Duration = item.Duration;
        Price = item.Price;
        Status = item.Status;
        Ingredients = item.Ingredients;
        Keywords = item.Keywords;
        Categories = item.Categories;
        Description = item.Description;
    }

    public static explicit operator SimpleItem(ItemModel item) => new(item);
}
