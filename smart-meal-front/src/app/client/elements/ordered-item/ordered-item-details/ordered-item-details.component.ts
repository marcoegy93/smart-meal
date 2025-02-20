import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChosenItems } from 'src/domain/model/Order';

@Component({
  selector: 'app-ordered-item-details',
  templateUrl: './ordered-item-details.component.html',
  styleUrl: './ordered-item-details.component.scss'
})
export class OrderedItemDetailsComponent {
  @Input() item?: ChosenItems;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  getTotalPrice(): number {
    return this.item && this.item.price && this.item.quantity ? this.item.price * this.item.quantity : 0;
  }
  
}