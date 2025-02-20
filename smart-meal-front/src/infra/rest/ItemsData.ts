import {GetAllItemsCriteria} from "src/domain/model/input/GetAllItemsCriteria";
import {IItem} from "src/domain/model/IItem";
import {Section} from "src/domain/model/Section";
import {Items} from "../../domain/external/Items";
import {Injectable} from "@angular/core";
import {RestApiProvider} from "./RestApiProvider";
import {HttpEventType} from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ItemsData extends Items {


  constructor(
    private provider: RestApiProvider,
    private authService: AuthService
  ) {
    super();
  }


  async getItemById(itemId: string): Promise<IItem | undefined> {
    try {
      const body = await this.provider.get<IItem | undefined>("Items/" + itemId)
      console.log(body);
      return body;
    }catch (error) {
      console.log(error);
      return undefined
    }
  }


  async getAllIngredients(restaurantId: string): Promise<string[]> {
    return await this.provider.get<string[]>("restaurants/" + restaurantId + "/Items/ingredients");
  }

  async getAllKeywords(restaurantId: string): Promise<string[]> {
    return await this.provider.get<string[]>("restaurants/" + restaurantId + "/Items/keywords");
  }

  async getAllCategories(restaurantId: string): Promise<string[]> {
   return await this.provider.get<string[]>("restaurants/" + restaurantId + "/Items/categories");
  }

  async getAllItems(criteria: GetAllItemsCriteria): Promise<IItem[]> {
    const path = "restaurants/" + criteria.restaurantId + "/Items";
    try {
      const body = await this.provider.post<IItem[]>(path, criteria);
      console.log(body);
      return body;
    }catch (error) {
      console.log(error);
      return []
    }
  }

  async createOrUpdateItems(restaurantId: string, itemToCreate: IItem): Promise<void> {
    try {
      const path = `restaurants/${restaurantId}/Items`;
      const headers = this.authService.getHeaders();
      const event = await this.provider.patch<any>(path, itemToCreate, undefined, headers);

      if (event.type === HttpEventType.Response) {
        if (event.status !== 201) {
          throw new Error('Item incomplet ou invalide');
        }
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAllSections(restaurantId: string): Promise<Section[]> {
    try {
    const path = "restaurants/" + restaurantId + "/Items/sections";
      const body = await this.provider.get<Section[]>(path);
      console.log(body);
      return body;
    }catch (error: any) {
      console.log(error);
      return []
    }
  }

  async updateSection(restaurantId: string, section: Section): Promise<void> {
    try {
      const path = `restaurants/${restaurantId}/Items/section`;
      const headers = this.authService.getHeaders();

      const event = await this.provider.patch<any>(path, section, undefined, headers);

      if (event.type === HttpEventType.Response) {
        if (event.status !== 200 && event.status !== 204) {
          throw new Error("Erreur lors de la mise à jour de la section : statut inattendu.");
        }
        console.log("Section mise à jour avec succès :", event.body);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la section :", error);
      throw error;
    }
  }



  getItem(itemId: string, restaurantId: string): Promise<IItem> {
    const path = `items/${itemId}`;
    return this.provider.get<IItem[]>(path);
  }

  async deleteItem(itemId: string): Promise<void> {
    try {
      const headers = this.authService.getHeaders();
      await this.provider.delete<void>(`Items/${itemId}`, undefined, headers);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async deleteSection(sectionId: string): Promise<void> {
    try {
      const headers = this.authService.getHeaders();
      await this.provider.delete<void>(`Items/sections/${sectionId}`, undefined, headers);
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  }

}
