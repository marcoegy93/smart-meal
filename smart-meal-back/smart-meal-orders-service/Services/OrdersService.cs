using smart_meal_orders_service.Contracts;
using smart_meal_orders_service.Enums;
using smart_meal_orders_service.Repositories;
using smart_meal_orders_service.Models;
using smart_meal_orders_service.Utils;

namespace smart_meal_orders_service.Services;

public class OrdersService : IOrdersService
{
    private readonly IOrdersRepository _ordersRepository;

    public OrdersService(IOrdersRepository ordersRepository)
    {
        _ordersRepository = ordersRepository;
    }

    public OrderModel ChangeOrderStatus(int orderId, OrderStatus newStatus)
    {
        return _ordersRepository.ChangeOrderStatus(orderId, newStatus);
    }

    public int CreateOrder(Order order)
    {
        return _ordersRepository.CreateOrder(order);
    }

    public List<OrderModel> GetOrder(OrderCriteria criteria, int restaurantId)
    {
        return _ordersRepository.GetOrder(criteria, restaurantId);
    }
}