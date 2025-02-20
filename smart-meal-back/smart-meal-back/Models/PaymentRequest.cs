using smart_meal_back.Enums;

namespace smart_meal_back.Models
{
    public class PaymentRequest
    {
        public string PaymentMethodId { get; set; }
        public long Amount { get; set; }
        public string Currency { get; set; }
        public PaymentType paymentType { get; set; }
        public string transactionId { get; set; }
    }
}
