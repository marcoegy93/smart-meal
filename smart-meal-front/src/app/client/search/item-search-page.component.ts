import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { OrderedItem } from 'src/domain/model/Aside';
import { IItem } from 'src/domain/model/IItem';
import { GetAllItemsCriteria } from 'src/domain/model/input/GetAllItemsCriteria';
import { Restaurant } from 'src/domain/model/Restaurant';
import { Section } from 'src/domain/model/Section';
import { Segment } from 'src/domain/model/Segment';
import { ItemsService } from 'src/domain/service/ItemsService';
import { RestaurantsService } from 'src/domain/service/RestaurantsService';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';

@Component({
  selector: 'app-item-search-page',
  templateUrl: './item-search-page.component.html',
  styleUrls: ['./item-search-page.component.scss'],
})
export class ItemSearchPageComponent implements OnInit, AfterViewInit {
  public restaurant: Restaurant | undefined;
  public sections: Section[] = [];
  public segments: Segment[] = [];
  public categories: string[] = [];
  public items: IItem[] = [];
  public filteredItems: IItem[] = [];
  public searchedItems: IItem[] = [];
  public isLoading: boolean = true;
  public restaurantId: string;
  public tableNumber?: number;
  public currentOrder: OrderedItem[] = [];
  public isPageError?: boolean = false;

  constructor(
    private itemsService: ItemsService,
    private routingService: RoutingService,
    private restaurantsService: RestaurantsService,
    private orderCacheService: OrderCacheService,
  ) {
    this.filterItemsByCriteria = this.filterItemsByCriteria.bind(this);
    this.filterItemsByRegex = this.filterItemsByRegex.bind(this);
    const restaurantId = this.routingService.getRestaurantIdFromRoute();
    this.tableNumber = this.routingService.getTableNumberFromRoute();
    if (!restaurantId) {
      this.routingService.navigateToHome();
      this.restaurantId = '';
    } else {
      this.restaurantId = restaurantId;
    }
  }

  ngOnInit(): void {
    this.initializeDashboard();
  }

  ngAfterViewInit(): void { }

  private initializeDashboard(): void {
    this.currentOrder = this.orderCacheService.getOrder(this.restaurantId);
    this.fetchRestaurantData(this.restaurantId)
      .then(() => this.fetchCategories(this.restaurantId))
      .then(() => this.fetchItems(this.restaurantId))
      .then(() => this.segments = this.getItemSegments())
      .catch((err) => console.error('Error initializing dashboard:', err))
      .finally(() => (this.isLoading = false));
  }

  private fetchRestaurantData(restaurantId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.restaurantsService.getRestaurant(restaurantId)
        .then((observable) => {
          observable.subscribe({
            next: (data) => {
              if (data.isVisible) {
                this.restaurant = data;
              } else {
                this.isPageError = true;
              } // Assign the first restaurant in the array
              resolve();
            },
            error: (err) => {
              console.error('Error fetching restaurant:', err);
              reject(err);
            }
          });
        })
        .catch((err) => {
          console.error('Error resolving restaurant observable:', err);
          reject(err);
        });
    });
  }

  private fetchCategories(restaurantId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.itemsService.getCategories(restaurantId).then((categories) => {
        this.categories = categories;
        resolve();
      }).catch((err) => {
        console.error('Error fetching sections:', err);
        reject(err);
      });
    });
  }


  private fetchItems(restaurantId: string, criteria?: GetAllItemsCriteria): Promise<void> {
    return new Promise((resolve, reject) => {
      this.itemsService.getItems(restaurantId, undefined, criteria).then((items) => {
        this.items = items;
        this.filteredItems = items;
        resolve();
      }).catch((err) => {
        console.error('Error fetching sections:', err);
        reject(err);
      });
    });
  }


  private fetchSections(restaurantId: string): Promise<void> {
    console.log("fetching sections")
    return new Promise((resolve, reject) => {
      this.itemsService.getSections(restaurantId).then((sections) => {
        this.sections = sections;
        console.log(sections)
        resolve();
      }).catch((err) => {
        console.error('Error fetching sections:', err);
        reject(err);
      });
    });
  }

  public getItemSegments(): Segment[] {
    return this.categories.map((category) => ({
      items: this.filteredItems.filter((item) => item.categories?.includes(category)),
      name: category,
      segmentId: category,
    }))
      .filter((segment) => segment.items.length > 0);
  }

  public filterItemsByCriteria(criteria: GetAllItemsCriteria): void {
    this.fetchItems(this.restaurantId, criteria)
      .then(() => this.segments = this.getItemSegments())
      .catch((err) => console.error('Error initializing dashboard:', err))
      .finally(() => (this.isLoading = false));
  }

  public filterItemsByRegex(regexString: string): void {
    console.log(regexString);

    // Create a regular expression object
    const regex = new RegExp(regexString, 'i'); // 'i' for case-insensitive matching

    // Filter items based on name or joined ingredients
    this.filteredItems = this.items.filter((item) =>
      regex.test(item.name || '') ||
      regex.test(item.ingredients?.join('-') || '')
    );

    console.log(this.filteredItems);

    // Update segments based on filtered items
    this.segments = this.getItemSegments();
  }


  addToOrder = (item: IItem): void => {
    const foundItem = this.currentOrder.find(order => order.itemId === item.itemId);
    if (foundItem) {
      foundItem.quantity += 1; // Increase the quantity
    } else {
      const orderedItem: OrderedItem = {
        itemId: item.itemId ?? "",
        name: item.name ?? "",
        quantity: 1,
        price: item.price ?? 0,
      }
      this.currentOrder.push(orderedItem);
    }
    this.orderCacheService.saveOrder(this.currentOrder);
    console.log(`${item.name} added to the order.`);
  };

  goToOrder(): void {
    this.routingService.navigateToCurrentOrderDetails(this.restaurantId, this.tableNumber);
  }

  scrollToSection(sectionName: string): void {
    console.log("scrolling")
    const element = document.getElementById(sectionName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getOrderQuanity(): number {
    return this.currentOrder.reduce((total, item) => total + item.quantity, 0);
  }
}
