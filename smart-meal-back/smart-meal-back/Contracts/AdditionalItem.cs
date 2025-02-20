using Newtonsoft.Json;
using smart_meal_back.Enums;
using smart_meal_back.Models;

namespace smart_meal_back.Contracts;

public class AdditionalItem : AbsItem
{
    public int Quantity { get; set; }

    [JsonConstructor]
    public AdditionalItem(int? itemId, int quantity, string? name, string? illustration, ItemType? type)
        : base(itemId, name, illustration, type)
    {
        Quantity = quantity;
    }

    public AdditionalItem(AdditionalItemModel additionalItemModel)
        : base(additionalItemModel.ItemId, additionalItemModel.Name, additionalItemModel.Illustration, additionalItemModel.Type)
    {
        Quantity = additionalItemModel.Quantity;
    }

    public static explicit operator AdditionalItem(AdditionalItemModel additionalItemModel) => new(additionalItemModel);
}