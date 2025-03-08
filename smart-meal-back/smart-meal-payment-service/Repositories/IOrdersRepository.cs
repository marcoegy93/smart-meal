using smart_meal_paiement_service.Models;

namespace smart_meal_paiement_service.Repositories;

public interface IOrdersRepository
{
    void UpdateOrderPayment(string paymentIntentId, PaymentRequest paymentRequest);
}