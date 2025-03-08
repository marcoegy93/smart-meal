using Newtonsoft.Json;
using smart_meal_orders_service.Enums;
using smart_meal_orders_service.Models;

namespace smart_meal_orders_service.Contracts;

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