namespace smart_meal_orders_service.Models;

public class AdditionalItemModel : AbsItemModel
{
    public int OrderId { get; set; }
    public int? ItemParentId { get; set; }
    public int Quantity { get; set; }
    public int ItemParentPosition { get; set; }
}