import { IItem } from "../IItem"

export interface CreateOrderInput {
  username: string;
  userFingerprint: string;
  orderDate?: string;
  chosenItems: OrderItemInput[];
  restaurantId?: number;
  orderId?: number;
  tableId?: number;
  orderDestination?: string;
  price?: number;
}

export interface OrderItemInput {
  itemId: number;
  quantity: number;
  additionalDetails?: { itemId: number; quantity: number; }[]
}
