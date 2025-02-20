using Newtonsoft.Json;
using smart_meal_back.Enums;
using smart_meal_back.Models;

namespace smart_meal_back.Contracts;

public class OrderItem : AbsItem
{
    public int Quantity { get; set; }
    public int Duration { get; set; }
    public double Price { get; set; }
    public List<AdditionalItem> AdditionalDetails { get; set; } = new List<AdditionalItem>();

    [JsonConstructor]
    public OrderItem(int? itemId, string? name, string? illustration, ItemType? type, int quantity, int duration, double price, List<AdditionalItem> additionalDetails)
        : base(itemId, name, illustration, type)
    {
        Quantity = quantity;
        Duration = duration;
        Price = price;
        AdditionalDetails = additionalDetails ?? new List<AdditionalItem>();
    }

    public OrderItem(OrderItemModel orderItemModel)
        : base(orderItemModel.ItemId, orderItemModel.Name, orderItemModel.Illustration, orderItemModel.Type)
    {
        Quantity = orderItemModel.Quantity;
        Duration = orderItemModel.Duration;
        Price = orderItemModel.Price;
        AdditionalDetails = orderItemModel.AdditionalDetails.Select(detail => (AdditionalItem)detail).ToList();
    }

    public static explicit operator OrderItem(OrderItemModel orderItemModel) => new(orderItemModel);
}

