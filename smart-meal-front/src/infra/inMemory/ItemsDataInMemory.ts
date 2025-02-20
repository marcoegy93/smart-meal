import { Observable, of } from "rxjs";
import { GetAllItemsCriteria } from "src/domain/model/input/GetAllItemsCriteria";
import { IItem } from "src/domain/model/IItem";
import { Section } from "src/domain/model/Section";
import { Items } from "../../domain/external/Items";
import { Injectable } from "@angular/core";
import { ItemsDb } from "./data/ItemsDb";

export interface ItemsMock {
  restaurantId: string
  items: IItem[]
}

export interface SectionsMock {
  restaurantId: string
  sections: Section[]
}

@Injectable({
  providedIn: 'root'
})
export class ItemsDataInMemory extends Items {

  public itemsMock: ItemsMock[] = ItemsDb.itemsMock;
  public sectionsMock: SectionsMock[] = ItemsDb.sectionsMock;
  public categoriesMock: string[] = ["Plat principal", "Dessert", "Boisson", "Entrée", "Spécialité", "Végétarien", "Mer", "Viande", "Petit déjeuner"];
  public ingredientsMock: string[] = ["Pomme de terre", "Steak", "Laitue", "Tomate", "Pain", "Beurre", "Fromage", "Jambon", "Saumon", "Crème fraîche", "Poulet", "Avocat", "Crevettes", "Oeuf", "Bacon", "Chocolat", "Pomme"];
  public keywordsMock: string[] = ["rapide", "populaire", "nouveau", "vegan", "traditionnel", "exotique", "sain", "biologique", "favori", "classique"];

  constructor() {
    super();
  }

  getItemById(itemId: string): Promise<IItem | undefined> {
    const itemsMocks = this.itemsMock.flatMap(item => item.items)
    return new Promise((resolve) => resolve(itemsMocks.find(item => item.itemId === itemId)));
  }

  getAllIngredients(restaurantId: string): Promise<string[]> {
    return new Promise((resolve) => resolve(this.ingredientsMock));
  }

  getAllKeywords(restaurantId: string): Promise<string[]> {
    return new Promise((resolve) => resolve(this.keywordsMock));
  }

  getAllCategories(restaurantId: string): Promise<string[]> {
    return new Promise((resolve) => resolve(this.categoriesMock));
  }

  getItem(itemId: string, restaurantId: string): Promise<IItem> {
    const itemsMocks = this.itemsMock.find(item => item.restaurantId === restaurantId)
    let foundItem = itemsMocks?.items?.find(item => item.itemId === itemId);
    if (foundItem) {
      return new Promise((resolve) => resolve(foundItem));
    }
    throw new Error("Item not found.");
  }

  getAllItems(criteria: GetAllItemsCriteria): Promise<IItem[]> {
    console.log(criteria)
    const itemsMocks = this.itemsMock.find(item => item.restaurantId === criteria.restaurantId)

    let itemWithCriteria = itemsMocks?.items;

    if (itemWithCriteria && criteria.type) {
      itemWithCriteria = itemWithCriteria.filter(item => item.type === criteria.type)
    }

    if (itemWithCriteria) {
      return new Promise((resolve) => resolve(itemWithCriteria));
    }

    return new Promise((resolve) => resolve([]));
  }

  public createOrUpdateItems(restaurantId: string, itemToCreate: IItem): Promise<void> {
    let restaurantItems = this.itemsMock.find(item => item.restaurantId === restaurantId);
    if (!restaurantItems) {
      throw new Error('Restaurant not found');
    }

    if (itemToCreate.itemId) {
      // Mise à jour d'un item existant
      const index = restaurantItems.items.findIndex(item => item.itemId === itemToCreate.itemId);
      if (index !== -1) {
        restaurantItems.items[index] = itemToCreate; // Mise à jour complète
      } else {
        // L'ID est donné mais l'item n'existe pas, le traiter comme une nouvelle insertion
        restaurantItems.items.push(itemToCreate);
      }
    } else {
      // Création d'un nouvel item
      itemToCreate.itemId = this.generateItemId(); // Suppose une méthode qui génère un ID unique
      restaurantItems.items.push(itemToCreate);
    }

    // Gestion des sections pour les items composés
    if (itemToCreate.type === "COMPOUND" && itemToCreate.sections) {
      itemToCreate.sections.forEach(section => {
        if (section.sectionId) {
          // Mise à jour ou ajout de référence d'une section existante
          let existingSection = this.findSectionById(section.sectionId);
          if (!existingSection) {
            // Si la section n'existe pas dans sectionsMock, l'ajouter
            this.addSectionToMock(restaurantId, section);
          }
        } else {
          // Création d'une nouvelle section sans ID existant
          section.sectionId = this.generateSectionId(); // Supposons une méthode qui génère un ID unique
          this.addSectionToMock(restaurantId, section);
        }
      });
    }
    console.log("I save")
    console.log(restaurantItems.items)
    return new Promise<void>(resolve => resolve());
  }

  private findSectionById(sectionId: string): Section | undefined {
    return this.sectionsMock.flatMap(sm => sm.sections).find(s => s.sectionId === sectionId);
  }

  private addSectionToMock(restaurantId: string, section: Section): void {
    let restaurantSections = this.sectionsMock.find(s => s.restaurantId === restaurantId);
    if (!restaurantSections) {
      restaurantSections = { restaurantId: restaurantId, sections: [] };
      this.sectionsMock.push(restaurantSections);
    }
    restaurantSections.sections.push(section);
  }

  private generateItemId(): string {
    // Générer un ID unique pour l'item
    return Math.random().toString(36).substr(2, 9);
  }

  private generateSectionId(): string {
    // Générer un ID unique pour la section
    return Math.random().toString(36).substr(2, 9);
  }
  updateItems(itemId: string, itemToUpdate: IItem): void {
    throw new Error("Method not implemented.");
  }

  getAllSections(restaurantId: string): Promise<Section[]> {
    const section = this.sectionsMock.find(section => section.restaurantId === restaurantId);
    if (section) {
      return new Promise((resolve) => resolve(JSON.parse(JSON.stringify(section.sections))));
    }
    return new Promise((resolve) => resolve([]));

  }

  deleteItem(itemId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteSection(sectionId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  updateSection(section: Section): void {
    throw new Error("Method not implemented.");
  }

  weatherForecastTest(): Observable<any> {
    throw new Error("Method not implemented.");
  }

}
