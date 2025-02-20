import { Items } from "../external/Items";
import { IItem } from "../model/IItem";
import { Section } from "../model/Section";
import { Injectable } from "@angular/core";
import { GetAllItemsCriteria } from "../model/input/GetAllItemsCriteria";
import { FirebaseStorageService } from "src/app/services/firebase-storage.service";

/*
* Currently, all step of form is saved on 'progressItem'.
* If a user reload the website, his data may be deleted.
* We need to find a solution to save properly all data
* to retrieve them even if the page is reloaded
*/
@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private items: Items,
    private firebaseStorageService: FirebaseStorageService) {
  }

  async getItems(restaurantId: string, type?: string, criteria?: GetAllItemsCriteria) {
    const tempCriteria: GetAllItemsCriteria = {
      restaurantId: restaurantId,
      type: type ?? undefined,
      categories: criteria?.categories ?? undefined,
      duration: criteria?.duration ?? undefined,
      ingredients: criteria?.ingredients ?? undefined,
      keywords: criteria?.keywords ?? undefined,
      minPrice: criteria?.minPrice ?? undefined,
      maxPrice: criteria?.maxPrice ?? undefined,
    }
    return await this.items.getAllItems(tempCriteria);
  }

  async getSections(restaurantId: string) {
    return await this.items.getAllSections(restaurantId)
  }

  async getItemById(itemId: string): Promise<IItem | undefined> {
    return await this.items.getItemById(itemId)
  }

  async getIngredients(restaurantId: string) {
    return await this.items.getAllIngredients(restaurantId);
  }

  async getKeywords(restaurantId: string) {
    return await this.items.getAllKeywords(restaurantId);
  }

  async getCategories(restaurantId: string) {
    return await this.items.getAllCategories(restaurantId);
  }

  async getItem(itemId: string, restaurantId: string) {
    return await this.items.getItem(itemId, restaurantId);
  }

  async saved(restaurantId: string, item: IItem) {
    const itemToCreate = this.processItem(item);

    if (itemToCreate.sections && itemToCreate.sections.length > 0) {
      for (const section of itemToCreate.sections) {
        await this.uploadItemIllustrations(section.items);
      }
    }
    if (item.illustration == undefined || !item.illustration.includes("firebase")) {
      itemToCreate.illustration = item.selectedIllustration == undefined ? "any" : await this.getUrlImage(item.selectedIllustration);
    }

    delete itemToCreate.selectedIllustration;
    itemToCreate.status = "ACTIVE";
    console.log(itemToCreate);
    try {
      await this.items.createOrUpdateItems(restaurantId, JSON.parse(JSON.stringify(itemToCreate)));
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async getUrlImage(selectedIllustration: File) {
    try {
      const filePath = `images/items/${new Date().getTime()}_${selectedIllustration.name}`
      return await this.firebaseStorageService.uploadFile(selectedIllustration, filePath);
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
      return "any";
    }
  }

  public async uploadItemIllustrations(sectionItems?: IItem[]): Promise<void> {
    if (sectionItems && sectionItems.length > 0) {
        for (let i = 0; i < sectionItems.length; i++) {
            const item = sectionItems[i];
            if (item.selectedIllustration && !item.illustration?.includes("firebase")) {
                const illustrationBlob = item.selectedIllustration;
                if (illustrationBlob) {
                    try {
                        item.illustration = await this.getUrlImage(illustrationBlob);
                        delete item.selectedIllustration;
                    } catch (error) {
                        console.error(
                            `Erreur lors de l'upload de l'image pour l'item ${i}:`,
                            error
                        );
                        return;
                    }
                }
            }
        }
    }
  }

  processItem(item: IItem): IItem {
    function cleanSection(section: Section): Section {
      // Étape 1 : Supprimer le champ "from"
      const { from, items, ...cleanedSection } = section;

      // Nettoyer récursivement les items de la section
      const cleanedItems = items?.map(cleanItem).filter(Boolean) || [];

      if (section.toUpdate === undefined && section.hasChange === undefined) {
        const { from, toUpdate, hasChange, ...cleanedSection } = section;
        return cleanedSection;
      }

      // Étape 2-5 : Application des règles
      if (section.toUpdate === false && section.sectionId !== undefined) {
        if (section.hasChange) {
          const { sectionId, hasChange, toUpdate, ...remaining } = cleanedSection;
          console.log(remaining)
          return { ...remaining, items: cleanedItems };
        } else {
          const { from, toUpdate, hasChange, ...cleanedSection } = section;
          return cleanedSection;
        }
      }

      if (section.toUpdate === true && section.sectionId !== undefined) {
        if (section.hasChange) {
          const { toUpdate, ...remaining } = cleanedSection;
          return { ...remaining, items: cleanedItems };
        } else {
          const { toUpdate, ...remaining } = cleanedSection;
          return { ...remaining, items: cleanedItems };
        }
      }

      if (section.toUpdate === true && section.sectionId === undefined) {
        const { toUpdate, ...remaining } = cleanedSection;
        return { ...remaining, items: cleanedItems };
      }

      return { ...cleanedSection, items: cleanedItems };
    }

    function cleanItem(inputItem: IItem): IItem {
      console.log(inputItem);
      // Étape 1 : Supprimer le champ "from"
      const { from, sections, ...cleanedItem } = inputItem;

      // Nettoyer récursivement les sections de l'item
      const cleanedSections = sections?.map(cleanSection).filter(Boolean) || [];

      if (inputItem.toUpdate === undefined && inputItem.hasChange === undefined && inputItem.sections === undefined) {
        const { from, sections, toUpdate, hasChange, ...cleanedItem } = inputItem;
        return cleanedItem;
      }


      // Étape 2-5 : Application des règles
      if (inputItem.toUpdate === false && inputItem.itemId !== undefined) {
        console.log("inputItem");
        console.log(inputItem);
        if (inputItem.hasChange) {

          const { itemId, hasChange, toUpdate, ...remaining } = cleanedItem;
          return { ...remaining, sections: cleanedSections };
        } else {
          console.log("inputItem");
          console.log(inputItem);
          const { from, sections, toUpdate, hasChange, ...cleanedItem } = inputItem;
          return cleanedItem;
        }
      }

      if (inputItem.toUpdate === true && inputItem.itemId !== undefined) {
        if (inputItem.hasChange) {
          const { toUpdate, ...remaining } = cleanedItem;
          return { ...remaining, sections: cleanedSections };
        } else {
          const { toUpdate, ...remaining } = cleanedItem;
          return { ...remaining, sections: cleanedSections };
        }
      }

      if (inputItem.toUpdate === true && inputItem.itemId === undefined) {
        const { toUpdate, ...remaining } = cleanedItem;
        return { ...remaining, sections: cleanedSections };
      }

      return { ...cleanedItem, sections: cleanedSections };
    }

    // Nettoyer l'élément principal
    return cleanItem(item) as IItem;
  }

  async deleteItem(itemId: string): Promise<void> {
    try {
      await this.items.deleteItem(itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async deleteSection(sectionId: string): Promise<void> {
    try {
      await this.items.deleteSection(sectionId);
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  }

  async updateSection(restaurantId: string, section: Section): Promise<void> {
    try {
      await this.items.updateSection(restaurantId, section);
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  }
}
