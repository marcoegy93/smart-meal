using Microsoft.AspNetCore.Mvc;
using smart_meal_orders_service.Contracts;
using smart_meal_orders_service.Enums;
using smart_meal_orders_service.Models;
using smart_meal_orders_service.Utils;

namespace smart_meal_orders_service.Services
{
    public interface IOrdersService
    {
        OrderModel ChangeOrderStatus(int orderId, OrderStatus newStatus);
        int CreateOrder(Order order);
        List<OrderModel> GetOrder(OrderCriteria criteria, int restaurantId);
    }
}