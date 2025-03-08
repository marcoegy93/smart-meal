using Dapper;
using smart_meal_payment_service.Models;
using smart_meal_payment_service.Utils;

namespace smart_meal_payment_service.Repositories;

public class OrdersRepository : IOrdersRepository
{
    private readonly DapperDBContext _dBContext;

    public OrdersRepository(DapperDBContext dBContext)
    {
        _dBContext = dBContext;
    }

    public void UpdateOrderPayment(string paymentIntentId, PaymentRequest paymentRequest)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();

        var query = @"
            UPDATE [Order]
            SET payment_id = @PaymentIntentId,
                payment_price = @TransactionTotal,
                status = @Status
            WHERE order_id = @TransactionId";

        var parameters = new DynamicParameters();
        parameters.Add("@PaymentIntentId", paymentIntentId);
        parameters.Add("@TransactionTotal", paymentRequest.Amount / 100);
        parameters.Add("@Status", 1);
        parameters.Add("@TransactionId", paymentRequest.transactionId);

        connection.Execute(query, parameters);
    }
}