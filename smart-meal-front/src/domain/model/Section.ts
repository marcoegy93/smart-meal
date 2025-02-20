import {IItem} from "./IItem";

export interface Section {
  items?: IItem[]
  name?: string
  type?: string
  position?: number
  choiceLimitMax?: number,
  choiceLimitMin?: number,
  sectionId?: string
  toUpdate?: boolean
  hasChange?: boolean
  from?: Section
}

export enum SectionType {
  MAIN, ADDITIONAL
}
