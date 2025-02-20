import {ItemType} from "../IItem";


export interface GetAllItemsCriteria {
  keywords?: string[]
  categories?: string[]
  ingredients?: string[]
  minPrice?: number,
  maxPrice?: number,
  type?: string
  restaurantId?: string
  duration?: DurationType
}
export enum DurationType {
  UNDER_5 = 'UNDER_5', UNDER_15 = 'UNDER_15', UNDER_30 = 'UNDER_30'
}

export interface PriceRange {
  min: number
  max: number
}
