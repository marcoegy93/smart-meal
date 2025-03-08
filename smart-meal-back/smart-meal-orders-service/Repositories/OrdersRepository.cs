using Dapper;
using Newtonsoft.Json;
using smart_meal_orders_service.Contracts;
using smart_meal_orders_service.Enums;
using smart_meal_orders_service.Models;
using smart_meal_orders_service.Utils;
using System.Data;

namespace smart_meal_orders_service.Repositories;

public class OrdersRepository : IOrdersRepository
{
    private readonly DapperDBContext _dBContext;

    public OrdersRepository(DapperDBContext dBContext)
    {
        _dBContext = dBContext;
    }

    public int CreateOrder(Order order)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();

        var itemsJson = JsonConvert.SerializeObject(order.ChosenItems.Select((item, index) => new OrderItemModel
        {
            ItemId = item.ItemId,
            Quantity = item.Quantity,
            Position = index + 1
        }));

        var additionalDetailsJson = JsonConvert.SerializeObject(order.ChosenItems
            .Where(item => item.AdditionalDetails != null)
            .SelectMany((item, index) => item.AdditionalDetails.Select(detail => new AdditionalItemModel
            {
                ItemParentId = item.ItemId,
                ItemId = detail.ItemId,
                Quantity = detail.Quantity,
                ItemParentPosition = index + 1
            })));


        var parameters = new DynamicParameters();
        parameters.Add("@RestaurantId", order.RestaurantId);
        parameters.Add("@Username", order.Username);
        parameters.Add("@UserFingerprint", order.UserFingerprint);
        parameters.Add("@TableId", order.TableId);
        parameters.Add("@OrderDestination", order.OrderDestination);
        parameters.Add("@Items", itemsJson);
        parameters.Add("@AdditionalDetails", additionalDetailsJson);
        parameters.Add("@OrderId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        connection.Execute("CreateOrder", parameters, commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@OrderId");
    }


public List<OrderModel> GetOrder(OrderCriteria criteria, int restaurantId)
{
    using var connection = _dBContext.CreateConnection();
    connection.Open(); 
    var parameters = new DynamicParameters();
    parameters.Add("@RestaurantId", restaurantId);
    using (var multi = connection.QueryMultiple("GetOrdersByRestaurantId", parameters, commandType: CommandType.StoredProcedure))
    {
        var orders = multi.Read<OrderModel>().ToList();
        var orderItems = multi.Read<OrderItemModel>().ToList();
        var additionalItems = multi.Read<AdditionalItemModel>().ToList();
            var selectedOrders = orders
                .Where(o => criteria.OrderId == null || o.OrderId == criteria.OrderId)
                .Where(o => criteria.UserFingerprint == null || o.UserFingerprint == criteria.UserFingerprint)
                .Where(o => criteria.CustomerName == null || o.Username == criteria.CustomerName)
                .Where(o => criteria.TableNumber == null || o.TableId == criteria.TableNumber)
                .Where(o => criteria.OrderDestination == null || o.OrderDestination == criteria.OrderDestination)
                .Where(o => criteria.OrderDate == null || criteria.OrderDate == DateTime.MinValue || o.OrderDate >= criteria.OrderDate)
                .ToList();

            if (selectedOrders == null)
        {
            return null;
        }

        var inProgressOrders = orders
            .Where(o => (o.Status == OrderStatus.IN_PROGRESS || o.Status == OrderStatus.READY) && o.RestaurantId == restaurantId)
            .OrderBy(o => o.OrderDate)
            .ToList();

        for (int i = 0; i < inProgressOrders.Count; i++)
        {
            inProgressOrders[i].Position = i + 1;
        }

        foreach (var order in orders)
        {
            order.ChosenItems = orderItems.Where(item => item.OrderId == order.OrderId).ToList();

            foreach (var item in order.ChosenItems.Where(i => i.Type == ItemType.COMPOUND))
            {
                item.AdditionalDetails = additionalItems
                    .Where(a => a.ItemParentId == item.ItemId && a.OrderId == order.OrderId && a.ItemParentPosition == item.Position)
                    .ToList();
            }
        }

        foreach (var order in inProgressOrders)
        {
            var previousOrders = inProgressOrders.Where(o => o.Position < order.Position).ToList();
            var previousDurations = previousOrders.Sum(o => o.ChosenItems.Sum(i => i.Duration * i.Quantity));
            var currentDurations = order.ChosenItems.Sum(i => i.Duration * i.Quantity);
            order.EstimatedTime = previousDurations + currentDurations;
        }

        return selectedOrders;
    }
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

    public OrderModel ChangeOrderStatus(int orderId, OrderStatus newStatus)
    {
        using var connection = _dBContext.CreateConnection();
        connection.Open();

        var parameters = new DynamicParameters();
        parameters.Add("@OrderId", orderId);
        parameters.Add("@NewStatus", newStatus);

        return connection.QuerySingleOrDefault<OrderModel>("ChangeOrderStatus", parameters, commandType: CommandType.StoredProcedure);
    }
}