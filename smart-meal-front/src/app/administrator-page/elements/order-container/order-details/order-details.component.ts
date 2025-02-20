import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Order, OrderStatus } from 'src/domain/model/Order';
import { OrdersService } from 'src/domain/service/OrderService';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
  @Input() order?: Order;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<void>();
  
  public OrderStatus = OrderStatus;

  constructor(private ordersService: OrdersService) { }

  onClose() {
    this.closeModal.emit();
  }

  getStatusClass(status: OrderStatus): string {
    return status.toLowerCase();
  }

  getTotalPrice(): number {
    if (!this.order?.chosenItems) return 0;
    return this.order.chosenItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  changeOrderStatus(newStatus: OrderStatus) {
    if (this.order && typeof this.order.orderId === 'number') {
        this.ordersService.updateOrderStatus(this.order.orderId, newStatus)
          .then(() => {
            if (this.order) {
              this.order.status = newStatus;
              this.statusChanged.emit();
              this.onClose();
            }
          })
          .catch(error => console.error('Erreur lors de la mise à jour du statut:', error));
    }
  } 
} 