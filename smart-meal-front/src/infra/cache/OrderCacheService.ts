import { D } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { OrderedItem } from 'src/domain/model/Aside';
import { GetAllItemsCriteria } from 'src/domain/model/input/GetAllItemsCriteria';
import { getType, getTypeString, OrderType, OrderTypeString } from 'src/domain/model/OrderType';

@Injectable({
  providedIn: 'root',
})
export class OrderCacheService {


  private readonly currentOrderCacheKey = 'currentOrder';
  private readonly orderTypeCacheKey = 'orderType';
  private readonly orderTimestampKeyCacheKey = 'orderTimestamp';
  private readonly tableInfoTimestampCacheKey = 'tableInfoTimestamp';
  private readonly customerNameCacheKey = 'customerName';
  private readonly tableNumberCacheKey = 'tableNumber';
  private readonly restuarantIdCacheKey = 'restaurantId';
  private readonly itemCriteriaCacheKey = 'itemCriteria';
  private readonly userFingerprintCacheKey = 'userFingerprint';
  private readonly orderExpirationTime = 15 * 60 * 1000; // 5 minutes
  private readonly tableInfoExpirationTime = 4 * 3600 * 1000; // 4 hours

  constructor() { }

  getOrderTimestamp(): Date {
    const savedTimestamp = Number(localStorage.getItem(this.orderTimestampKeyCacheKey));
    return new Date(savedTimestamp);
  }

  saveTableInfoTimestamp(): void {
    console.log("Saving table number time")
    console.log(new Date().toISOString())
    localStorage.setItem(this.tableInfoTimestampCacheKey, new Date().toISOString());
  }

  getTableInfoTimestamp(): Date {
    const savedTimestamp = localStorage.getItem(this.tableInfoTimestampCacheKey);
    console.log("Got from getOrderTimestamp")
    console.log(savedTimestamp)
    console.log(savedTimestamp ? new Date(savedTimestamp) : null)
    return savedTimestamp ? new Date(savedTimestamp) : new Date();
  }

  // new Date(Date.now())
  saveOrder(items: OrderedItem[]): void {
    localStorage.setItem(this.currentOrderCacheKey, JSON.stringify(items));
    localStorage.setItem(this.orderTimestampKeyCacheKey, new Date().toISOString());
  }

  getOrder(restaurantId: string): OrderedItem[] {
    const cachedOrder = localStorage.getItem(this.currentOrderCacheKey);
    const timestamp = localStorage.getItem(this.orderTimestampKeyCacheKey);
    const isSameRestaurant = localStorage.getItem(this.restuarantIdCacheKey) === restaurantId;
    const isExpired = timestamp ? this.isExpired(new Date(timestamp), this.orderExpirationTime) : true;
    console.log("Checking order cache conformity")
    console.log('check:', cachedOrder, timestamp, isSameRestaurant, isExpired)
    if (!timestamp || isExpired || !isSameRestaurant) {
      console.log("Order expired")
      console.log(cachedOrder)
      console.log(timestamp)
      console.log(this.isExpired(new Date(timestamp??0), this.orderExpirationTime))
      this.clearOrder();
      return [];
    }

    return cachedOrder ? JSON.parse(cachedOrder) : [];
  }

  clearOrder(): void {
    console.log("Clearing order")
    localStorage.removeItem(this.currentOrderCacheKey);
    localStorage.removeItem(this.orderTimestampKeyCacheKey);
  }

  private isExpired(timestamp: Date, expirationTime: number): boolean {
    const currentTime = Date.now();
    const timestampMs = timestamp.getTime();
    const timeDiff = currentTime - timestampMs;
    return timeDiff > expirationTime;
  }

  saveRestaurantId(restaurantId: string): void {
    localStorage.setItem(this.restuarantIdCacheKey, restaurantId);
  }

  // Table number

  saveTableNumber(tableNumber: number, newTableNumber?: boolean): void {
    if (newTableNumber || tableNumber !== parseInt(localStorage.getItem(this.tableNumberCacheKey) || '0', 10)) {
      console.log("SOrderservice : aving tableNumber")
      console.log(tableNumber)
      console.log(tableNumber.toString())
      localStorage.setItem(this.tableNumberCacheKey, tableNumber.toString());
      localStorage.setItem(this.tableInfoTimestampCacheKey, new Date().toISOString());
    } else {
      console.log("Table number already saved")
      console.log('Params:', tableNumber, localStorage.getItem(this.tableNumberCacheKey))
    }
  }


  getTableNumber(): number | null {
    const cachedTableNumber = parseInt(localStorage.getItem(this.tableNumberCacheKey) || '0', 10);
    const timestamp = localStorage.getItem(this.tableInfoTimestampCacheKey);

    if (!timestamp || this.isExpired(new Date(timestamp), this.tableInfoExpirationTime)) {
      console.log("Table number expired")
      localStorage.removeItem(this.currentOrderCacheKey);
      localStorage.removeItem(this.tableInfoTimestampCacheKey);
      return null;
    }

    return cachedTableNumber;
  }

  // Customer name

  saveCustomerName(customerName: string): void {
    if (customerName !== localStorage.getItem('customerName')) {
      console.log("Saving customerName")
      console.log(customerName)
      localStorage.setItem('customerName', customerName);
      localStorage.setItem(this.tableInfoTimestampCacheKey, new Date().toISOString());
    } else {
      console.log("Customer name already saved")
    }
  }

  checkOrClearCustomerName(): void {
    const timestamp = localStorage.getItem(this.tableInfoTimestampCacheKey);
    if (!timestamp || this.isExpired(new Date(timestamp), this.tableInfoExpirationTime)) {
      console.log("Customer name expired")
      localStorage.removeItem(this.currentOrderCacheKey);
      localStorage.removeItem(this.customerNameCacheKey);
      localStorage.removeItem(this.tableInfoTimestampCacheKey);
    }
  }

  getCustomerName(): string | null {
    const cachedCustomerName = localStorage.getItem(this.customerNameCacheKey);
    return cachedCustomerName;
  }

  getOrderType(): string {
    return localStorage.getItem(this.orderTypeCacheKey) || OrderTypeString.EMPORTER;
  }

  setOrderType(selectOrderType: OrderType): void {
    const orderTpe = getTypeString(selectOrderType)
    if (orderTpe !== localStorage.getItem(this.orderTypeCacheKey)) {
      localStorage.setItem(this.orderTypeCacheKey, orderTpe ?? '');
      console.log("Order type saved and removing table number")
      localStorage.removeItem(this.tableNumberCacheKey);
      localStorage.removeItem(this.tableInfoTimestampCacheKey);
      // Save timestamp when switching to pickup
      if (orderTpe === OrderTypeString.EMPORTER) {
        localStorage.setItem(this.tableInfoTimestampCacheKey, new Date().toISOString());
      }
    } else {
      console.log("Order type already saved")
    }
  }

  saveItemCriteria(criteria: GetAllItemsCriteria) {
    return localStorage.setItem(this.itemCriteriaCacheKey, JSON.stringify(criteria));
  }
  getItemCriteria(): GetAllItemsCriteria | undefined {
    const cachedCriteria = localStorage.getItem(this.itemCriteriaCacheKey);
    return cachedCriteria ? JSON.parse(cachedCriteria) : undefined;
  }

  verifyCacheConformity(routingService: RoutingService): boolean {
    // set when user arrives on restaurant dashboard
    const cachedOrderType = localStorage.getItem(this.orderTypeCacheKey) ;
    // set when user creates an order
    const cachedOrder = localStorage.getItem(this.currentOrderCacheKey);
    // set when user interacts with the current order
    const timestamp = localStorage.getItem(this.orderTimestampKeyCacheKey);
    // set when user arrives on restaurant dashboard with specific table number
    const cachedTableNumber = localStorage.getItem(this.tableNumberCacheKey);
    // set when user modifies customer name
    const cachedCustomerName = localStorage.getItem(this.customerNameCacheKey);
    // set when user arrives on restaurant dashboard
    const cachedRestaurantId = localStorage.getItem(this.restuarantIdCacheKey);
    // set when user information (number or name) is modified and saved
    const cachedTableInfoTimestamp = localStorage.getItem(this.tableInfoTimestampCacheKey);

    if (routingService.getRestaurantIdFromRoute() !== cachedRestaurantId) {
      console.log("Restaurant ID mismatch")
      localStorage.removeItem(this.restuarantIdCacheKey);
      localStorage.removeItem(this.currentOrderCacheKey);
      localStorage.removeItem(this.tableInfoTimestampCacheKey);
      localStorage.removeItem(this.orderTimestampKeyCacheKey);
      return false;
    }

    if(cachedOrderType == "Sur place") {
    if (!cachedTableNumber || routingService.getTableNumberFromRoute() !== parseInt(cachedTableNumber ?? '0', 10) || !cachedTableInfoTimestamp || this.isExpired(new Date(cachedTableInfoTimestamp), this.tableInfoExpirationTime)) {
          console.log("Table number mismatch - Removing tableInfo")
          console.log('Table number from route:', routingService.getTableNumberFromRoute(), cachedTableNumber)
          localStorage.removeItem(this.tableNumberCacheKey);
          localStorage.removeItem(this.tableInfoTimestampCacheKey);
          return false;
        }
    } else if(cachedOrderType == "A emporter") {

    } else {
     console.error('Invalid order type:', cachedOrderType);
        return false;
    }
    return true;



    console.log("Cached order: ", cachedOrder);
    console.log("Cached timestamp: ", timestamp);
    console.log("Cached table number: ", cachedTableNumber);
    console.log("Cached customer name: ", cachedCustomerName);
    console.log("Cached restaurant ID: ", cachedRestaurantId);
    console.log("Cached table info timestamp: ", cachedTableInfoTimestamp);
  }


  getUserFingerprint() {
    return localStorage.getItem(this.userFingerprintCacheKey);
  }

  saveUserFingerprint(fingerprint: any) {
    return localStorage.setItem(this.userFingerprintCacheKey, fingerprint);
  }
}
