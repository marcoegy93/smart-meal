import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IItem} from "../../../domain/model/IItem";
import {Section} from "../../../domain/model/Section";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input()
  public type!: string

  @Input()
  public name!: string

  @Input()
  public item?: IItem

  @Input()
  public section?: Section

  @Input()
  public index?: number

  @Output()
  public cardClicked = new EventEmitter<IItem>();

  @Output() deleteItem = new EventEmitter<IItem>();

  @Output() deleteSection = new EventEmitter<Section>();

  @Output() sectionClicked = new EventEmitter<Section>();

  async removeItem(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.deleteItem.emit(this.item);
  }

  removeSection(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.deleteSection.emit(this.section);
  }

  onCardClick() {
    if (this.type === 'ITEM' && this.item) {
      this.cardClicked.emit(this.item);
    } else if (this.type === 'SECTION' && this.section) {
      this.sectionClicked.emit(this.section);
    }
  }
}
