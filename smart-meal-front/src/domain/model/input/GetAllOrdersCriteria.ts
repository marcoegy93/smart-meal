import {OrderStatus} from "../Order";

export interface GetAllOrdersCriteria {
  orderId?: number
  orderDate?: Date
  customerName?: string
  tableNumber?: number
  userFingerprint?: string;
  // from develop
  // restaurantId: string;
  // orderType?: string;
  // orderCode?: string;
}


