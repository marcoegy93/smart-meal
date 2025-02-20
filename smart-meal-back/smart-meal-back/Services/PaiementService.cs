using Microsoft.AspNetCore.Mvc;
using smart_meal_back.Enums;
using smart_meal_back.IRepositories;
using smart_meal_back.IServices;
using smart_meal_back.Models;
using Stripe;

namespace smart_meal_back.Services
{
    public class PaiementService: IPaiementService
    {

        private readonly string _stripeSecretKey;
        private readonly IOrdersRepository _ordersRepository;

        public PaiementService(IOrdersRepository ordersRepository)
        {
            _stripeSecretKey = Environment.GetEnvironmentVariable("SECRET_STRIPE");
            StripeConfiguration.ApiKey = _stripeSecretKey;
            _ordersRepository = ordersRepository;
        }
        public async Task<PaymentResponse> CreatePaymentAsync(PaymentRequest request)
        {
            try
            {
                var paymentIntentService = new PaymentIntentService();
                var paymentIntent = await paymentIntentService.CreateAsync(new PaymentIntentCreateOptions
                {
                    Amount = request.Amount,
                    Currency = request.Currency,
                    PaymentMethod = request.PaymentMethodId,
                    Confirm = true,
                    ReturnUrl = "https://smartmeal.fr",
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true,
                        AllowRedirects = "never"
                    }
                });

                if (paymentIntent.Status == "requires_action")
                {
                    return new PaymentResponse
                    {
                        RequiresAction = true,
                        ClientSecret = paymentIntent.ClientSecret,
                        Success = false
                    };
                }

                if (paymentIntent.Status == "succeeded")
                {
                    switch (request.paymentType) 
                    {
                        case PaymentType.CUSTOMER_ORDER:
                            _ordersRepository.UpdateOrderPayment(paymentIntent.Id, request);
                            break; 
                    }

                    return new PaymentResponse { Success = true };
                }

                return new PaymentResponse
                {
                    Success = false,
                    Error = "Le paiement a échoué"
                };
            }
            catch (StripeException e)
            {
                return new PaymentResponse
                {
                    Success = false,
                    Error = e.Message
                };
            }
        }

        public async Task<PaymentResponse> ConfirmPaymentAsync([FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                var paymentIntentService = new PaymentIntentService();
                var paymentIntent = await paymentIntentService.GetAsync(request.PaymentIntentId);

                if (paymentIntent.Status == "succeeded")
                {
                    // Logique métier après confirmation réussie
                    return new PaymentResponse { Success = true };
                }

                return null;
            }
            catch (StripeException e)
            {
                return null;
            }
        }

    }
}
