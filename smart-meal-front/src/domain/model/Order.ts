import { IItem } from "./IItem";

export enum OrderStatus {
  READY = 'READY',
  TO_PAY = 'TO_PAY',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export interface Order {
  restaurantId: number,
  orderDate: string,
  orderNumber: string;
  username: string;
  status: OrderStatus;
  position: number
  chosenItems: ChosenItems[]
  orderId?: number
  estimatedTime?: number
}

export interface ChosenItems {
  quantity: number,
  duration?: number,
  additionalDetails?: ChosenItems[],
  itemId: number,
  name: string,
  illustration: string,
  type: string,
  price?: number,
}
