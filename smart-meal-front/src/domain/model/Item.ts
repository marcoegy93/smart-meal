import {IItem, ItemType} from "./IItem";
import {Section} from "./Section";
import {firstValueFrom} from "rxjs";

export class Item implements IItem {
  type: string;
  name?: string;
  description?: string;
  illustration?: string;
  duration?: number;
  price?: number;
  status?: string;
  ingredients?: string[];
  keywords?: string[];
  categories?: string[];
  itemId?: string;
  sections?: Section[];
  from?: IItem;
  id?: number;
  selectedIllustration?: File

  constructor(type: ItemType) {
    this.type = type.toString()
    this.ingredients = []
    this.keywords = []
    this.categories = []
    this.sections = []
  }

  static from(item: IItem) {
    let itemToMap = new Item(ItemType[item.type as keyof typeof ItemType])
    itemToMap.name = item.name
    itemToMap.description = item.description
    itemToMap.illustration = item.illustration
    itemToMap.duration = item.duration
    itemToMap.price = item.price
    itemToMap.status = item.status
    itemToMap.ingredients = item.ingredients
    itemToMap.keywords = item.keywords
    itemToMap.categories = item.categories
    itemToMap.itemId = item.itemId
    itemToMap.sections = item.sections
    itemToMap.from = item.from
    itemToMap.id = item.id
    itemToMap.selectedIllustration = item.selectedIllustration
    return itemToMap
  }

  public setCommonItemData(item: Item | IItem): Item {
    this.type = item.type
    this.name = item.name
    this.description = item.description
    this.illustration = item.illustration
    this.selectedIllustration = item.selectedIllustration
    this.duration = item.duration
    this.price = item.price
    this.status = item.status
    this.ingredients = item.ingredients
    this.keywords = item.keywords
    this.categories = item.categories
    return this
  }

  public addSection(section: Section, index?: number): Item {

    if (index !== undefined && index >= 0 && this.sections) {
      console.log(index)
      console.log(section)
      this.sections[index] = section;
      return this
    }

    this.sections?.push(section)
    return this
  }

  public removeItemOnSection(nameOfSection: string, indexOfItem: number) {
    const section = this.sections?.find(section => section.name === nameOfSection);
    console.log(section)
    if (section) {
      section.items?.splice(indexOfItem, 1)
    }
    console.log(section)
    return this
  }

  removeSection(index: number): Item {
    this.sections?.splice(index, 1)
    return this
  }
}
