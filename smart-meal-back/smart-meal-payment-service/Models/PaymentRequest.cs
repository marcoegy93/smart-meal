﻿using smart_meal_payment_service.Enums;

namespace smart_meal_payment_service.Models;

public class PaymentRequest
{
    public string PaymentMethodId { get; set; }
    public long Amount { get; set; }
    public string Currency { get; set; }
    public PaymentType paymentType { get; set; }
    public string transactionId { get; set; }
}
