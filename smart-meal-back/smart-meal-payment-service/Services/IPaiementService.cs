using Microsoft.AspNetCore.Mvc;
using smart_meal_paiement_service.Models;

namespace smart_meal_paiement_service.Services;

public interface IPaiementService
{
    Task<PaymentResponse> CreatePaymentAsync(PaymentRequest request);
    Task<PaymentResponse> ConfirmPaymentAsync([FromBody] ConfirmPaymentRequest request);
}
