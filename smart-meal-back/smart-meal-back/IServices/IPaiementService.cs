using Microsoft.AspNetCore.Mvc;
using smart_meal_back.Models;

namespace smart_meal_back.IServices
{
    public interface IPaiementService
    {
        Task<PaymentResponse> CreatePaymentAsync(PaymentRequest request);
        Task<PaymentResponse> ConfirmPaymentAsync([FromBody] ConfirmPaymentRequest request);
    }
}
