import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IItem } from 'src/domain/model/IItem';
import { ChosenItems, Order, OrderStatus } from 'src/domain/model/Order';

@Component({
  selector: 'app-ordered-item',
  templateUrl: './ordered-item.component.html',
  styleUrls: ['./ordered-item.component.scss'],
})
export class OrderedItemComponent {

  @Input() order!: Order;
  @Input() restaurantId!: string;
  // @Output() addToOrder = new EventEmitter<IItem>();
  @Input() addToOrder!: (item: Order) => void;

  public showItemDetails: boolean = false;
  public selectedItem?: ChosenItems;

  constructor(private router: Router) { }

  getChosenItems(chosenItems: ChosenItems[]): string {
    return chosenItems.map(item => item.name).join(', ') || '';
  }

  // getItemPrice(items: ChosenItems): number {
  //   return items.;
  // }

  viewItemDetail(item: ChosenItems): void {
    this.selectedItem = item;
    this.showItemDetails = true;
  }

  onAddToOrder(): void {
    this.addToOrder(this.order);
  }

  getStatusClass(): string {
    switch (this.order.status) {
      case OrderStatus.READY:
        return 'preparing';
      case OrderStatus.IN_PROGRESS:
        return 'preparing';
      case OrderStatus.TO_PAY:
        return 'pending';
      case OrderStatus.DONE:
        return 'done';
      default:
        return '';
    }
  }

  getStatusLabel(): string {
    switch (this.order.status) {
      case OrderStatus.READY:
        return 'EN PRÉPARATION';
      case OrderStatus.IN_PROGRESS:
        return 'EN PRÉPARATION';
      case OrderStatus.TO_PAY:
        return 'EN ATTENTE DE PAIEMENT';
      case OrderStatus.DONE:
        return 'TERMINÉE';
      default:
        return '';
    }
  }

  getPreparationTime(order: Order): string | null {
    if (this.order.status === OrderStatus.READY || this.order.status === OrderStatus.IN_PROGRESS) {
      return order.estimatedTime + ' MINS';
    }
    return null;
  }

  getWaitingPosition(order: Order): number | null {
    if (this.order.status === OrderStatus.READY || this.order.status === OrderStatus.IN_PROGRESS) {
      return order.position;
    }
    return null;
  }

  getTotalPrice(): number {
    return this.order.chosenItems.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  }

  formatDate(dateString: string | undefined): string | undefined {
    if (!dateString) return undefined;
    const formattedDateString = `${dateString}Z`;

    const date = new Date(formattedDateString);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
    };

    const formattedTime = new Intl.DateTimeFormat('fr-FR', timeOptions).format(date);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', dateOptions).format(date);

    return `${formattedDate} à ${formattedTime.replace(':', 'h')}`;
  }

}
