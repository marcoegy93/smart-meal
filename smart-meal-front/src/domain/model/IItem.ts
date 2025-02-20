import {Section} from "./Section";

export interface IItem {
  type: string
  name?: string,
  description?: string,
  illustration?: string
  duration?: number
  price?: number
  status?: string
  ingredients?: string[]
  keywords?: string[]
  categories?: string[]
  itemId?: string
  sections?: Section[]
  from?: IItem
  id?: number
  toUpdate?: boolean
  hasChange?: boolean
  selectedIllustration?: File
}

export enum ItemType {
  SIMPLE = 'SIMPLE', COMPOUND = 'COMPOUND'
}

export enum ItemStatus {
  ACTIVE, OUT_OF_STOCK, CANCELLED
}
