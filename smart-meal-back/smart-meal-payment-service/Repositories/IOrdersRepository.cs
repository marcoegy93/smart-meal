using smart_meal_payment_service.Models;

namespace smart_meal_payment_service.Repositories;

public interface IOrdersRepository
{
    void UpdateOrderPayment(string paymentIntentId, PaymentRequest paymentRequest);
}