using smart_meal_back.Contracts;
using smart_meal_back.Enums;

namespace smart_meal_back.Models
{
    public class OrderModel
    {
        public int? OrderId { get; set; }
        public int? RestaurantId { get; set; }
        public string Username { get; set; }
        public string? UserFingerprint { get; set; }
        public int Position { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemModel> ChosenItems { get; set; } = new List<OrderItemModel>();
        public int EstimatedTime { get; set; }
        public int? TableId { get; set; }
        public string? OrderDestination { get; set; }
        public double PaymentPrice { get; set; }
    }
}
