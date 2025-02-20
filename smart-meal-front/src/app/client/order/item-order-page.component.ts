import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItem } from 'src/domain/model/IItem';
import { Restaurant } from 'src/domain/model/Restaurant';
import { Section } from 'src/domain/model/Section';
import { ItemsService } from 'src/domain/service/ItemsService';
import { RestaurantsService } from 'src/domain/service/RestaurantsService';
import { Location } from '@angular/common';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';
import { OrderedItem } from 'src/domain/model/Aside';
import { OrdersService } from 'src/domain/service/OrderService';
import { CreateOrderInput, OrderItemInput } from 'src/domain/model/input/CreateOrderInput';
import { mapOrderedItemsToOrderInputs } from '../utils/MapUtils';
import { RoutingService } from 'src/app/services/routing.service';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Component({
  selector: 'app-item-order-page',
  templateUrl: './item-order-page.component.html',
  styleUrls: ['./item-order-page.component.scss'],
})
export class ItemOrderPageComponent implements OnInit, AfterViewInit {
  public restaurant: Restaurant | undefined;
  public sections: Section[] = [];
  public searchedItems: IItem[] = [];
  public currentOrder: OrderedItem[] = [];
  public isLoading: boolean = true;
  public restaurantId: string;
  public tableNumber?: number;
  public fingerprint!: string;


  constructor(
    private itemsService: ItemsService,
    private orderCacheService: OrderCacheService,
    private routingService: RoutingService
  ) {
    this.increaseOrderQuantity = this.increaseOrderQuantity.bind(this);
    this.decreaseOrderQuantity = this.decreaseOrderQuantity.bind(this);
    const restaurantId = this.routingService.getRestaurantIdFromRoute();
    this.tableNumber = this.routingService.getTableNumberFromRoute();
    if (!restaurantId) {
      this.routingService.navigateToHome();
      this.restaurantId = '';
    } else {
      this.restaurantId = restaurantId;
    }
  }

  async ngOnInit() {
    console.log(this.orderCacheService.getOrder(this.restaurantId));
    this.initializeDashboard();
    var cachedFingerprint = this.orderCacheService.getUserFingerprint();
    if(!cachedFingerprint) {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      this.fingerprint = result.visitorId;
      this.orderCacheService.saveUserFingerprint(this.fingerprint)
    } else {
      this.fingerprint = cachedFingerprint;
    }
    console.log('Fingerprint:', this.fingerprint);
  }

  ngAfterViewInit(): void { }

  private initializeDashboard(): void {
    this.currentOrder = this.orderCacheService.getOrder(this.restaurantId);
    console.log("currentOrder")
    console.log(this.currentOrder)
    this.fetchItems(this.restaurantId)
      .catch((err) => console.error('Error initializing dashboard:', err))
      .finally(() => (this.isLoading = false));
  }

  private fetchItems(restaurantId: string): Promise<void> {
    console.log("fetching sections")
    return new Promise((resolve, reject) => {
      this.itemsService.getItems(restaurantId)
        .then((data) => {
          this.searchedItems = data;
          resolve();
        })
        .catch((err) => {
          console.error('Error fetching items:', err);
          reject(err);
        });
    });
  }


  increaseOrderQuantity(itemId: string): void {
    const item = this.currentOrder.find(order => order.itemId === itemId);
    if (item) {
      item.quantity += 1;
      this.orderCacheService.saveOrder(this.currentOrder);
    } else {
      console.error(`Item with ID ${itemId} not found in the current order.`);
    }
  }

  decreaseOrderQuantity(itemId: string): void {

    const itemIndex = this.currentOrder.findIndex(order => order.itemId === itemId);

    if (itemIndex > -1) {
      const item = this.currentOrder[itemIndex];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.currentOrder.splice(itemIndex, 1);
      }
      this.orderCacheService.saveOrder(this.currentOrder)
    } else {
      console.error(`Item with ID ${itemId} not found in the current order.`);
    }
  }


  navigateBack(): void {
    this.routingService.navigateToRestaurantDashboard(this.restaurantId, this.tableNumber);
  }

  getItemById(itemId: string): IItem {
    return this.searchedItems.find((item) => item.itemId === itemId) || {
      itemId: '',
      name: '',
      price: 0,
      type: '',
      ingredients: []
    };
  }

  calculatePrice(): number {
    let sum = 0;
    this.currentOrder.map((orderItem => sum += (orderItem.price * orderItem.quantity)));
    return sum;
  }

  clearOrder() {
    console.log("Clearing order from item order page")
    this.orderCacheService.clearOrder();
    this.routingService.navigateToRestaurantDashboard(this.restaurantId, this.tableNumber);
  }

  async confirmOrder() {
    const chosenItems: OrderItemInput[] = mapOrderedItemsToOrderInputs(this.currentOrder);
    const orderType = this.orderCacheService.getOrderType();
    const tableNumber = this.orderCacheService.getTableNumber();
    const username = this.orderCacheService.getCustomerName();
    
    const orderData: CreateOrderInput = {
      username: username ?? "",
      userFingerprint: this.fingerprint,
      chosenItems,
      restaurantId: parseInt(this.restaurantId),
      tableId: tableNumber ?? undefined,
      orderDestination: orderType,
      price: this.calculatePrice()
    };
    
    this.routingService.navigateToItemPayment(
      this.restaurantId,
      this.tableNumber,
      orderData
    );
  }

  getMissingSectionsRequirements(): string[] {
    const messages: string[] = [];
    if (!this.orderCacheService.getCustomerName()) {
      messages.push('Entrez votre nom');
    }
    if (!this.currentOrder.length) {
      messages.push('Ajoutez des articles au panier');
    }
    return messages;
  }

  canConfirmOrder(): boolean {
    return !!this.orderCacheService.getCustomerName() && this.currentOrder.length > 0;
  }

}
