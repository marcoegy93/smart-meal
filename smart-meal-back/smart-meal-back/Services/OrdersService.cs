using smart_meal_back.Contracts;
using smart_meal_back.Enums;
using smart_meal_back.IRepositories;
using smart_meal_back.IServices;
using smart_meal_back.Models;
using smart_meal_back.Repositories;
using smart_meal_back.Utils;

namespace smart_meal_back.Services;

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