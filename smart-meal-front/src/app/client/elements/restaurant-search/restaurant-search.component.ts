import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-restaurant-search',
  templateUrl: './restaurant-search.component.html',
  styleUrls: ['./restaurant-search.component.scss'],
})
export class RestaurantSearchComponent {
  @Input() filterRestaurantByRegex!: (regex: string) => void;
  public showFilterRestaurantForm: boolean = false;

  constructor() {}

  handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterRestaurantByRegex(inputElement.value);
  }

  openContainer(): void {
    this.showFilterRestaurantForm = true;
  }
  closeContainer(): void {
    this.showFilterRestaurantForm = false;
  }
}
