import {GetAllItemsCriteria} from "../model/input/GetAllItemsCriteria";
import {Section} from "../model/Section";
import {IItem} from "../model/IItem";
import {Observable} from "rxjs";

export abstract class Items {
  abstract getAllItems(criteria: GetAllItemsCriteria): Promise<IItem[]>
  abstract getItem(itemId: string, restaurantId: string): Promise<IItem>
  abstract createOrUpdateItems(restaurantId: string, itemToCreate: IItem): Promise<void>
  abstract getAllSections(restaurantId: string): Promise<Section[]>
  abstract updateSection(restaurantId: string, section: Section): void
  abstract getAllIngredients(restaurantId: string): Promise<string[]>
  abstract getAllKeywords(restaurantId: string): Promise<string[]>
  abstract getAllCategories(restaurantId: string): Promise<string[]>
  abstract getItemById(itemId: string): Promise<IItem | undefined>
  abstract deleteItem(itemId: string): Promise<void>
  abstract deleteSection(sectionId: string): Promise<void>
}
