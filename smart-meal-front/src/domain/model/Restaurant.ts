import {Administrator} from "./Administrator";

export interface Restaurant {
  isVisible?: boolean;
  restaurantId?: string,
  name: string,
  illustration: string
  address: string
  siret: string
  tva: string
  categoriesOfItemAvailable?: string[]
  admin?: Administrator
  averagePrice?: number
  contractUrl?: string
  paymentId?: string
}
