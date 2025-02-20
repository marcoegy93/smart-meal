import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OrderedItem } from 'src/domain/model/Aside';
import { IItem } from 'src/domain/model/IItem';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent {
  @Input() item!: IItem;
  @Input() orderedItem!: OrderedItem;
  @Input() restaurantId!: string;
  // @Output() addToOrder = new EventEmitter<IItem>();
  @Input() increaseOrderQuantity!: (itemId: string) => void;
  @Input() decreaseOrderQuantity!: (itemId: string) => void;


  constructor(private router: Router) {
  console.log(this.orderedItem) }

  viewItemDetail(): void {
  
    this.router.navigate(['/customer/item-detail'], { queryParams: { restaurantId: this.restaurantId, itemId: this.item.itemId } });
  }

  onAddToOrder(): void {
    // this.addToOrder(this.item);
  }

    getItemIngredients(): string[] {
    // If it's a SIMPLE item, return the item's ingredients
    if (this.item.type === 'SIMPLE') {
      return this.item.ingredients || [];
    }

    // Otherwise, traverse the `orderedItem.asides` and collect all item names
    const ingredients: string[] = [];
    if (this.orderedItem.asides) {
      for (const section of this.orderedItem.asides) {
        for (const sectionItem of section.items) {
          ingredients.push(sectionItem.name);
        }
      }
    }

    return ingredients;
  }
}
