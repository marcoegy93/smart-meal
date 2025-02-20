import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IItem } from 'src/domain/model/IItem';
import { Item } from 'src/domain/model/Item';
import { Section } from 'src/domain/model/Section';


@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent {
  @Input() categoryName!: string;
  @Input() restaurantId!: string;
  @Input() tableNumber?: number;
  @Input() items!: IItem[];
  @Input() addToOrder!: (item: IItem) => void;
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;

  constructor() { }
}
