using Microsoft.AspNetCore.Mvc;
using smart_meal_back.Contracts;
using smart_meal_back.Enums;
using smart_meal_back.Models;
using smart_meal_back.Utils;

namespace smart_meal_back.IServices
{
    public interface IOrdersService
    {
        OrderModel ChangeOrderStatus(int orderId, OrderStatus newStatus);
        int CreateOrder(Order order);
        List<OrderModel> GetOrder(OrderCriteria criteria, int restaurantId);
    }
}