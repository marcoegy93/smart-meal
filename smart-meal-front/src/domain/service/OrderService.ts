import { Injectable } from "@angular/core";
import { Restaurant } from "../model/Restaurant";
import { Restaurants } from "../external/Restaurants";
import { UserKitchen } from "../model/UserKitchen";
import { Orders } from "../external/Orders";
import { GetAllOrdersCriteria } from "../model/input/GetAllOrdersCriteria";
import { Order, OrderStatus } from "../model/Order";
import { CreateOrderInput } from "../model/input/CreateOrderInput";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private orders: Orders) {
  }

  async getAllOrders(restaurantId: string, criteria: GetAllOrdersCriteria){
    return await this.orders.getAllOrders(restaurantId, criteria);
  }

  async createOrder(orderToCreate: CreateOrderInput) {
    return await this.orders.createOrder(orderToCreate)
  }

  async updateOrderStatus(orderId: number, newStatus: OrderStatus){
    return await this.orders.updateOrderStatus(orderId, newStatus);
  }
}
