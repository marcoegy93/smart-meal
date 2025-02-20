using smart_meal_back.Contracts;
using smart_meal_back.Enums;
using smart_meal_back.Models;
using smart_meal_back.Utils;

namespace smart_meal_back.IRepositories
{
    public interface IOrdersRepository
    {
        OrderModel ChangeOrderStatus(int orderId, OrderStatus newStatus);
        int CreateOrder(Order order);
        List<OrderModel> GetOrder(OrderCriteria criteria, int restaurantId);
        void UpdateOrderPayment(string paymentIntentId, PaymentRequest paymentRequest);

    }
}