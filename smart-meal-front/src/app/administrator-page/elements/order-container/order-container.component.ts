import { Component, OnInit } from '@angular/core';
import { OwlOptions } from "ngx-owl-carousel-o";
import { OrdersService } from 'src/domain/service/OrderService';
import { Order, OrderStatus } from 'src/domain/model/Order';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-order-container',
  templateUrl: './order-container.component.html',
  styleUrl: './order-container.component.scss'
})
export class OrderContainerComponent implements OnInit {
  public orders: Order[] = [];
  public filteredOrders: Order[] = [];
  public selectedStatus: OrderStatus | undefined = undefined;
  public OrderStatus = OrderStatus;
  public selectedOrder?: Order;
  public showOrderDetails: boolean = false;

  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    nav: true,
    navText: [
      '<span class="material-symbols-outlined">arrow_back_ios_new</span>',
      '<span class="material-symbols-outlined">arrow_forward_ios</span>',
    ],
    responsive: {
      0: {
        items: 1
      },
      450: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    }
  };

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadOrders();
  }

  private async loadOrders() {
    try {
      const restaurantId = this.authService.getUserData().restaurantId;
      this.orders= await this.ordersService.getAllOrders(restaurantId, { });
      this.filterOrders();
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  public filterByStatus(status: OrderStatus | undefined) {
    this.selectedStatus = status;
    this.filterOrders();
  }

  private filterOrders() {
    if (!this.selectedStatus) {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
    console.log(this.filteredOrders);
  }

  public getItemsText(itemCount: number | undefined): string {
    if (!itemCount) return '0 article';
    return `${itemCount} article${itemCount > 1 ? 's' : ''}`;
  }

  getEmptyStateText(): string {
    switch (this.selectedStatus) {
      case OrderStatus.IN_PROGRESS:
        return "Aucune commande en cours pour l'instant";
      case OrderStatus.READY:
        return "Aucune commande prête à être préparée pour l'instant";
      case OrderStatus.TO_PAY:
        return "Aucune commande à payer pour le moment";
      case OrderStatus.DONE:
        return "Aucune commande terminée pour le moment";
      case OrderStatus.CANCELLED:
        return "Aucune commande annulée";
      default:
        return "Aucune commande n'a encore été ajoutée";
    }
  }

  openOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  onStatusChanged() {
    this.loadOrders(); // Recharge toutes les commandes
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.IN_PROGRESS:
        return 'status-in-progress';
      case OrderStatus.READY:
        return 'status-ready';
      case OrderStatus.TO_PAY:
        return 'status-to-pay';
      case OrderStatus.DONE:
        return 'status-done';
      case OrderStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }
}


