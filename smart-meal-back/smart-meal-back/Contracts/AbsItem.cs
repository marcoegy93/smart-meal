using Newtonsoft.Json;
using smart_meal_back.Enums;

namespace smart_meal_back.Contracts;

public abstract class AbsItem
{
    public int? ItemId { get; set; }
    public string? Name { get; set; }
    public string? Illustration { get; set; }

    public ItemType? Type { get; set; }

    [JsonConstructor]
    public AbsItem(int? itemId, string? name, string? illustration, ItemType? type)
    {
        ItemId = itemId;
        Name = name;
        Illustration = illustration;
        Type = type;
    }
}
