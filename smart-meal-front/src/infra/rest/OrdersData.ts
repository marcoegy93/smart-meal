import { Observable, from } from "rxjs";
import { GetAllOrdersCriteria } from "src/domain/model/input/GetAllOrdersCriteria";
import { Order, OrderStatus } from "src/domain/model/Order";
import { Orders } from "../../domain/external/Orders";
import { Injectable } from "@angular/core";
import { RestApiProvider } from "./RestApiProvider";
import { CreateOrderInput } from "src/domain/model/input/CreateOrderInput";
import { AuthService } from "src/app/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class OrdersData extends Orders {

  constructor(private provider: RestApiProvider,
    private authService: AuthService
  ) {
    super();
  }

  async getAllOrders(restaurantId: string, criteria: GetAllOrdersCriteria): Promise<Order[]> {
    try {
      const body = await this.provider.post<void>("Orders/restaurants/" + restaurantId + "/getOrders", criteria)
      console.log(body);
      return body.map((order: any) => ({
        ...order,
        status: OrderStatus[order.status as keyof typeof OrderStatus]
      }));
    } catch (error) {
      console.log(error);
      return []
    }
  }

  async createOrder(orderToCreate: CreateOrderInput): Promise<number> {
    try {
      const body = await this.provider.post<number>("Orders/createOrder", orderToCreate)
      console.log(body);
      return body;
    } catch (error) {
      console.log(error);
      return 1;
    }
  }

  async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<Order> {
    try {
      const headers = this.authService.getHeaders();
      return await this.provider.put<Order>(`Orders/${orderId}/changeStatus`, { newStatus }, undefined, headers);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
