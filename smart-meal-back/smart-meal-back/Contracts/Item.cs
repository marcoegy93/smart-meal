using Newtonsoft.Json;
using smart_meal_back.Enums;

namespace smart_meal_back.Contracts;

public class Item : SimpleItem
{
    public List<Section>? Sections { get; set; }

    [JsonConstructor]
    public Item(
    int? itemId,
    int? restaurantId,
    string name,
    string illustration,
    ItemType type,
    int duration,
    double price,
    ItemStatus status,
    List<string>? ingredients,
    List<string>? keywords,
    List<string>? categories,
    List<Section>? sections,
    string? description)
        : base(itemId, restaurantId, name, illustration, type, duration, price, status, ingredients, keywords, categories,description)
    {
        Sections = sections;
    }

    public Item(ItemModel item)
        : base(item.ItemId, item.RestaurantId, item.Name, item.Illustration, item.Type, item.Duration, item.Price, item.Status, item.Ingredients, item.Keywords, item.Categories, item.Description)
    {
        Sections = item.Sections?.Select(section => (Section)section).ToList();
    }

    public static explicit operator Item(ItemModel item) => new(item);
}
