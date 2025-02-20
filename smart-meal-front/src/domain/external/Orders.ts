import { CreateOrderInput } from "../model/input/CreateOrderInput";
import {GetAllOrdersCriteria} from "../model/input/GetAllOrdersCriteria";
import {Order, OrderStatus} from "../model/Order";
import {Observable} from "rxjs";

export abstract class Orders {
  abstract getAllOrders(restaurantId: string, criteria: GetAllOrdersCriteria): Promise<Order[]>
  abstract createOrder(orderToCreate: CreateOrderInput): Promise<number>
  abstract updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order>
}


