namespace smart_meal_payment_service.Models;

public class PaymentResponse
{
    public bool Success { get; set; }
    public bool RequiresAction { get; set; }
    public string ClientSecret { get; set; }
    public string Error { get; set; }
}
