using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smart_meal_orders_service.Contracts;
using smart_meal_orders_service.Enums;
using smart_meal_orders_service.Services;
using smart_meal_orders_service.Utils;
using System.Data;

namespace smart_meal_orders_service.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrdersService _orderService;

    public OrdersController(IOrdersService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("createOrder")]
    public IActionResult CreateOrder(Order order)
    {
        int orderId = _orderService.CreateOrder(order);
        return Ok(orderId);
    }

    [HttpPost("restaurants/{restaurantId}/getOrders")]
    public ActionResult<List<Order>> GetOrders(int restaurantId, OrderCriteria criteria)
    { 
        var orders = _orderService.GetOrder(criteria, restaurantId);
        if (orders == null || !orders.Any())
        {
            return NotFound(); // Handle the case where no orders match
        }
        return orders.Select(o => (Order)o).ToList();
    }

    [Authorize]
    [HttpPut("{orderId}/changeStatus")]
    public ActionResult<Order> ChangeOrderStatus(int orderId, ChangeOrderStatusRequest request)
    {
        if (string.IsNullOrEmpty(request.NewStatus) || !Enum.TryParse<OrderStatus>(request.NewStatus, true, out var status))
        {
            return BadRequest("Invalid or missing order status");
        }

        var updatedOrder = _orderService.ChangeOrderStatus(orderId, status);
        return Ok((Order)updatedOrder);
    }
}
