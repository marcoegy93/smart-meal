using Newtonsoft.Json;
using smart_meal_back.Enums;
using smart_meal_back.Models;

namespace smart_meal_back.Contracts
{
    public class Order
    {
        [JsonConstructor]
        public Order(
            int? orderId,
            int? restaurantId,
            string username,
            string? userFingerprint,
            int? position,
            int? tableId, 
            string? orderDestination,
            OrderStatus? status,
            DateTime orderDate,
            int estimatedTime,
            List<OrderItem> chosenItems,
            int? paymentId,
            double? totalPaid)
        {
            OrderId = orderId;
            RestaurantId = restaurantId;
            Username = username;
            UserFingerprint = userFingerprint;
            Position = position;
            Status = status;
            OrderDate = orderDate;
            TableId = tableId;
            OrderDestination = orderDestination;
            EstimatedTime = estimatedTime;
            ChosenItems = chosenItems ?? new List<OrderItem>();
        }

        public Order(OrderModel orderModel)
        {
            OrderId = orderModel.OrderId;
            RestaurantId = orderModel.RestaurantId;
            Username = orderModel.Username;
            UserFingerprint = orderModel.UserFingerprint;
            Position = orderModel.Position;
            Status = orderModel.Status;
            OrderDate = orderModel.OrderDate;
            TableId = orderModel.TableId;
            EstimatedTime = orderModel.EstimatedTime;
            ChosenItems = orderModel.ChosenItems.Select(item => (OrderItem)item).ToList();
        }

        public int? OrderId { get; set; }
        public int? RestaurantId { get; set; }
        public string Username { get; set; }
        public string? UserFingerprint { get; set; }
        public int? Position { get; set; }
        public int? TableId { get; set; }
        public string? OrderDestination { get; set; }
        public int EstimatedTime { get; set; }
        public OrderStatus? Status { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItem> ChosenItems { get; set; } = new List<OrderItem>();

        public static explicit operator Order(OrderModel orderModel) => new(orderModel);
    }
}
