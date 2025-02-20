import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IItem } from 'src/domain/model/IItem';
import { Section } from 'src/domain/model/Section';
import { Location } from '@angular/common';
import { Segment } from 'src/domain/model/Segment';
import { GetAllItemsCriteria } from 'src/domain/model/input/GetAllItemsCriteria';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() segments!: Segment[];
  @Input() activeSection!: string | null;
  @Input() isDesktopView: boolean = false;
  @Input() isFalseSearch: boolean = true;
  @Input() filterItemsByRegex!: (regex: string) => void;
  @Input() filterItemsByCriteria!: (criteria: GetAllItemsCriteria) => void;
  @Input() onClickFilter?: () => void;
  @Output() addToOrder = new EventEmitter<IItem>();
  public showFilterItemsForm: boolean = false;
  public restaurantId: string;
  public tableNumber?: number;

  constructor(
    private location: Location,
    private routingService: RoutingService,
  ) {
    const restaurantId = this.routingService.getRestaurantIdFromRoute();
    this.tableNumber = this.routingService.getTableNumberFromRoute();
    this.closeContainer = this.closeContainer.bind(this);
    if (!restaurantId) {
      this.restaurantId = '';
      this.tableNumber = -1;
    } else {
      this.restaurantId = restaurantId;
    }
    window.addEventListener('resize', this.updateScreenSize.bind(this));
  }

  handleFilter(criteria: GetAllItemsCriteria): void {
    console.log(criteria)
    this.filterItemsByCriteria(criteria);
  }

  handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterItemsByRegex(inputElement.value);
  }


  navigateToSearch(): void {
    if (this.isFalseSearch) {
      this.routingService.navigateToItemSearch(this.restaurantId, this.tableNumber);
    }

  }

  navigateToHome(): void {
    this.location.back();
  }

  scrollToSection(sectionId: string): void {
    console.log("scrolling to")
    console.log(sectionId)
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openContainer(): void {
    this.showFilterItemsForm = true;
  }
  closeContainer(): void {
    this.showFilterItemsForm = false;
  }

  handleClickFilter(event: Event) {
    if (this.onClickFilter) {
      this.onClickFilter()
    } else {
      this.openContainer();
    }
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  private updateScreenSize() {
    const screenWidth = window.innerWidth;
    this.isDesktopView = screenWidth > 1000;
    if (this.isDesktopView) {
      this.closeContainer();
    }
  }
}
