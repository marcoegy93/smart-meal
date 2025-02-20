import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {

  constructor(private router: Router, private route: ActivatedRoute) { }

  navigateToHome(): void {
    console.log("Navigating to home")
    this.router.navigate(['/']);
  }

  navigateToRestaurantDashboard(restaurantId: string, tableNumber?: number): void {
    this.router.navigate(['/customer/restaurant'], { queryParams: { restaurantId, tableNumber } });
  }

  navigateToItemDetail(restaurantId: string, itemId: string, tableNumber?: number): void {
    this.router.navigate(['/customer/item-detail'], { queryParams: { restaurantId, tableNumber, itemId } });
  }
  navigateToItemSearch(restaurantId: string, tableNumber?: number): void {
    this.router.navigate(['/customer/item-search'], { queryParams: { restaurantId, tableNumber } });
  }

  navigateToItemPayment(restaurantId: string, tableNumber?: number, orderData?: any): void {
    this.router.navigate(['/customer/item-payment'], {
      queryParams: { 
        restaurantId, 
        tableNumber 
      },
      state: {
        orderData
      }
    });
  }

  navigateToCurrentOrderDetails(restaurantId: string, tableNumber?: number, orderId?: string, orderPrice?: number): void {
    this.router.navigate(['/customer/item-order'], {
      queryParams: { restaurantId, tableNumber },
      state: {
        orderId,
        orderPrice,
      }
    });
  }

  navigateToOrdersView(restaurantId: string, tableNumber?: number, orderId?: number): void {
    this.router.navigate(['/customer/orders-view'], {
      queryParams: { restaurantId, tableNumber, orderId },
      state: {
        orderId,
      }
    });

  }

  navigateWithQueryParams(route: string, queryParams: { [key: string]: any }): void {
    this.router.navigate([route], { queryParams });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Generic method for flexibility
  navigateTo(route: string, params: any[] = []): void {
    this.router.navigate([route, ...params]);
  }

  getRestaurantIdFromRoute(): string | undefined {
    return this.route.snapshot.queryParams['restaurantId'];
  }
  getItemIdFromRoute(): string | undefined {
    return this.route.snapshot.queryParams['itemId'];
  }

  getOrderIdFromRoute(): string | null {
    return this.route.snapshot.queryParams['orderId'];
  }

  getTableNumberFromRoute(): number | undefined {
    const number = this.route.snapshot.queryParams['tableNumber'];
    if (number) {
      return parseInt(number);
    }
    return undefined;
  }

  getState(): any {
    return this.router.getCurrentNavigation()?.extras.state;
  }
}
