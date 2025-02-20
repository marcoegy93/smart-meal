namespace smart_meal_back.Models;

public class OrderItemModel : AbsItemModel
{
    public int OrderId { get; set; }
    public int Quantity { get; set; }
    public int Duration { get; set; }
    public int Position { get; set; }
    public double Price { get; set; }
    public List<AdditionalItemModel> AdditionalDetails { get; set; } = new List<AdditionalItemModel>();
}