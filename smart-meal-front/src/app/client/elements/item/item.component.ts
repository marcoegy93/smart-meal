import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingService } from 'src/app/services/routing.service';
import { IItem } from 'src/domain/model/IItem';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
  @Input() item!: IItem;
  @Input() restaurantId!: string;
  @Input() tableNumber?: number;
  // @Output() addToOrder = new EventEmitter<IItem>();
  @Input() addToOrder!: (item: IItem) => void;

  constructor(private routingService: RoutingService) { }

  viewItemDetail(): void {
  console.log('params', this.restaurantId, this.item.itemId, this.tableNumber);
    this.routingService.navigateToItemDetail(this.restaurantId, this.item.itemId ?? '0', this.tableNumber);
  }

  onAddToOrder(): void {
    this.addToOrder(this.item);
  }
}
