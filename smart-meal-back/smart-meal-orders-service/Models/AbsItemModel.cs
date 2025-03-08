using smart_meal_orders_service.Enums;

namespace smart_meal_orders_service.Models;

public abstract class AbsItemModel
{
    public int? ItemId { get; set; }
    public string Name { get; set; }
    public string Illustration { get; set; }
    public ItemType Type { get; set; }
}