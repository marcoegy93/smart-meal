namespace smart_meal_back.Utils
{
    public class OrderCriteria
    {
        public int? OrderId { get; set; }
        public DateTime? OrderDate { get; set; }
        public string? CustomerName { get; set; }
        public string? UserFingerprint { get; set; }
        public int? TableNumber { get; set; }
        public string? OrderDestination { get; set; }
        public int? RestaurantId { get; set; }

    }
}