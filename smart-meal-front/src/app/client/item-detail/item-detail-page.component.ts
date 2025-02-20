import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IItem } from 'src/domain/model/IItem';
import { Section } from 'src/domain/model/Section';
import { ItemsService } from 'src/domain/service/ItemsService';
import { Location } from '@angular/common';
import { OrderedSection, OrderedItem } from 'src/domain/model/Aside';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-item-detail-page',
  templateUrl: './item-detail-page.component.html',
  styleUrls: ['./item-detail-page.component.scss'],
})
export class ItemDetailPageComponent implements OnInit, AfterViewInit {
  public item!: IItem;
  public itemQuantity: number = 1;
  public currentOrder: OrderedItem[] = [];
  public selectedSection: OrderedSection[] = [];
  public isLoading: boolean = true;
  public restaurantId: string;
  public itemId: string;
  public tableNumber?: number;


  constructor(
    private routingService: RoutingService,
    private location: Location,
    private itemsService: ItemsService,
    private orderCacheService: OrderCacheService,
  ) {
    const restaurantId = this.routingService.getRestaurantIdFromRoute();
    const tableNumber = this.routingService.getTableNumberFromRoute();
    const itemId = this.routingService.getItemIdFromRoute();
    const isValid = this.orderCacheService.verifyCacheConformity(this.routingService)
    if (!isValid) {
      this.routingService.navigateToHome();
    }
    console.log("params", restaurantId, itemId, tableNumber)
    if (itemId) {
      this.tableNumber = tableNumber;
      this.restaurantId = restaurantId ?? '';
      this.itemId = itemId;
      this.orderCacheService.saveRestaurantId(restaurantId ?? '');
    } else {
      this.routingService.navigateToHome();
      this.restaurantId = '';
      this.itemId = '';
    }
  }

  ngOnInit(): void {
    this.initializePage();
  }

  ngAfterViewInit(): void { }

  private initializePage(): void {
    this.currentOrder = this.orderCacheService.getOrder(this.restaurantId);
    this.fetchItemData(this.itemId, this.restaurantId)
      .catch((err) => console.error('Error initializing item detail page:', err))
      .finally(() => (this.isLoading = false));
  }

  private fetchItemData(itemId: string, restaurantId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.itemsService.getItem(itemId, restaurantId)
        .then((data) => {
          this.item = data;
          resolve();
        })
        .catch((err) => {
          console.error('Error resolving restaurant observable:', err);
          reject(err);
        });
    });
  }

  navigateBack(): void {
    this.routingService.navigateToRestaurantDashboard(this.restaurantId, this.tableNumber);
  }

  goToOrder(): void {
    this.routingService.navigateToCurrentOrderDetails(this.restaurantId, this.tableNumber);
  }

    // Get quantity of a specific item in a section
  getAsideItemQuantity(sectionId: string, itemId: string): number {
    const section = this.selectedSection.find(s => s.sectionId === sectionId);
    const item = section?.items.find(i => i.itemId === itemId);
    return item?.quantity || 0;
  }

  addAsideItem(aside: Section, itemId: string): void {
    // Check if the aside is already in the list
    const existingAside = this.selectedSection.find((a) => a.sectionId === aside.sectionId);

    const selectedItem = aside?.items?.find((item) => item.itemId == itemId)

    const orderedAside = {
      itemId: selectedItem?.itemId || "",
      name: selectedItem?.name || "",
      price: selectedItem?.price || 0,
    }

    if (existingAside) {
      // If the aside exists, check if the selected item exists in the aside
      const existingItem = existingAside.items.find((item) => item.itemId === itemId);
      if (existingItem) {
        existingItem.quantity += 1; // Increment the quantity
      } else {
        existingAside.items.push({ ...orderedAside, quantity: 1 }); // Add the new item to the aside
      }
    } else {
      // Add the aside with the selected item
      this.selectedSection.push({
        name: aside?.name ?? "",
        sectionId: aside.sectionId,
        items: [{ ...orderedAside, quantity: 1 }],
      });
    }
  }

  removeAsideItem(asideId: string, itemId: string): void {
    const existingAside = this.selectedSection.find((a) => a.sectionId === asideId);

    if (existingAside) {
      // Check if the item exists in the aside
      const itemIndex = existingAside.items.findIndex((item) => item.itemId === itemId);

      if (itemIndex > -1) {
        const item = existingAside.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1; // Decrement the quantity
        } else {
          // Remove the item if quantity is 0
          existingAside.items.splice(itemIndex, 1);
        }
      }

      // Remove the aside if it has no items left
      if (existingAside.items.length === 0) {
        this.selectedSection = this.selectedSection.filter((a) => a.sectionId !== asideId);
      }
    }
  }

    // Helper function to get total quantity in a section
  private getTotalSectionQuantity(sectionId: string): number {
    const section = this.selectedSection.find(s => s.sectionId === sectionId);
    if (!section) return 0;
    return section.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Check if we can add more items to a section
  canAddAsideItem(section: Section, itemId: string): boolean {
    if (!section.choiceLimitMax) return true;
    const currentQuantity = this.getTotalSectionQuantity(section.sectionId || '');
    return currentQuantity < section.choiceLimitMax;
  }

  // Check if we can remove an item
  canRemoveAsideItem(sectionId: string, itemId: string): boolean {
    const quantity = this.getAsideItemQuantity(sectionId, itemId);
    return quantity > 0;
  }



  // Check if all section requirements are met
  canConfirmOrder(): boolean {
    if (this.item?.type == 'SIMPLE') return true
    if (!this.item?.sections) return false;

    return this.item.sections.every(section => {
      const currentQuantity = this.getTotalSectionQuantity(section.sectionId || '');
      const minLimit = section.choiceLimitMin || 0;
      const maxLimit = section.choiceLimitMax || Infinity;

      return currentQuantity >= minLimit && currentQuantity <= maxLimit;
    });
  }

  // Get messages for sections that need more selections
  getMissingSectionsRequirements(): string[] {
    if (!this.item?.sections) return [];

    return this.item.sections
      .filter(section => {
        const currentQuantity = this.getTotalSectionQuantity(section.sectionId || '');
        return currentQuantity < (section.choiceLimitMin || 0);
      })
      .map(section => {
        const currentQuantity = this.getTotalSectionQuantity(section.sectionId || '');
        const remaining = (section.choiceLimitMin || 0) - currentQuantity;
        return `${section.name}: ${remaining} choix restant${remaining > 1 ? 's' : ''}`;
      });
  }



  confirmItem(): void {
    // Create an OrderedItem with the selected asides and add it to the current order
    const orderedItem: OrderedItem = {
      itemId: this.item.itemId || '',
      name: this.item.name || '',
      price: this.item.price || 0,
      quantity: 1,
      asides: this.selectedSection,
    };

    this.currentOrder.push(orderedItem);
    this.orderCacheService.saveOrder(this.currentOrder);

    console.log('Item confirmed and added to order:', orderedItem);
    console.log('Current order:', this.currentOrder);

    this.routingService.navigateToRestaurantDashboard(this.restaurantId, this.tableNumber);

    //this.navigateBack();
  }

  resetItem(): void {
    this.currentOrder = [];
    this.selectedSection = [];
    this.goToOrder();
  }

}
