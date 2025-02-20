import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Restaurant } from 'src/domain/model/Restaurant';
import { RestaurantsService } from 'src/domain/service/RestaurantsService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];

  constructor(private restaurantService: RestaurantsService) {
  this.filterRestaurants = this.filterRestaurants.bind(this);

  }

  async ngOnInit() {
    await this.fetchAllRestaurants();
  }

  private async fetchAllRestaurants() {
    this.restaurants = await this.restaurantService.getRestaurants();
    this.filteredRestaurants = this.restaurants;
  }

  filterRestaurants(regexString: string) {
    console.log(regexString);

  // Create a regular expression object
  const regex = new RegExp(regexString, 'i'); // 'i' for case-insensitive matching

  // Filter items based on name or joined ingredients
  this.filteredRestaurants = this.restaurants.filter((restaurant) => regex.test(restaurant.name || ''));
  }
}
