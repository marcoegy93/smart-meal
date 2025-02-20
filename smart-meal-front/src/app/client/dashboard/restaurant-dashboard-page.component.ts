import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IItem } from 'src/domain/model/IItem';
import { Restaurant } from 'src/domain/model/Restaurant';
import { Section } from 'src/domain/model/Section';
import { ItemsService } from 'src/domain/service/ItemsService';
import { RestaurantsService } from 'src/domain/service/RestaurantsService';
import { SectionComponent } from '../elements/section/section.component';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';
import { OrderedItem } from 'src/domain/model/Aside';
import { Segment } from 'src/domain/model/Segment';
import { GetAllItemsCriteria } from 'src/domain/model/input/GetAllItemsCriteria';
import { RoutingService } from 'src/app/services/routing.service';
import { UserInfoComponent } from '../elements/user-info/user-info.component';
import { getTypeString, OrderType, OrderTypeString } from 'src/domain/model/OrderType';


@Component({
  selector: 'app-restaurant-dashboard-page',
  templateUrl: './restaurant-dashboard-page.component.html',
  styleUrls: ['./restaurant-dashboard-page.component.scss'],
})
export class RestaurantDashboardPageComponent implements OnInit, AfterViewInit {

  public restaurant: Restaurant | undefined;
  public sections: Section[] = [];
  public segments: Segment[] = [];
  public categories: string[] = [];
  public items: IItem[] = [];
  public currentOrder: OrderedItem[] = [];
  public isLoading: boolean = true;
  public activeSection: string | null = null;
  public restaurantId: string;
  public tableNumber: number | undefined;
  public orderTypes: string[] = [OrderTypeString.SUR_PLACE, OrderTypeString.EMPORTER];
  public selectedOrderType: OrderType = OrderType.EMPORTER;
  public isDropdownOpen: boolean = false;
  public userAddress: string = '8 Rue de Fabien, 75011 Paris';
  public startQrScanner: boolean = false;
  public isPageError: boolean = false;
  public isPageLoading: boolean = true;
  public showFilterItemsForm: boolean = false;
  public isDesktopView: boolean = false;
  public isSticky = false;

  @ViewChild(UserInfoComponent) userInfoComponent!: UserInfoComponent;

  @ViewChildren(SectionComponent) htmlSections!: QueryList<SectionComponent>;
  constructor(
    private routingService: RoutingService,
    private itemsService: ItemsService,
    private restaurantsService: RestaurantsService,
    private orderCacheService: OrderCacheService,
  ) {
    this.filterItemsByCriteria = this.filterItemsByCriteria.bind(this);
    this.onClickSearchFilter = this.onClickSearchFilter.bind(this);
    const restaurantId = this.routingService.getRestaurantIdFromRoute();
    this.tableNumber = this.routingService.getTableNumberFromRoute();

    if (!restaurantId) {
      this.restaurantId = '';
      this.isPageError = true;
    } else {
      this.restaurantId = restaurantId ?? '';
      this.orderCacheService.saveRestaurantId(restaurantId ?? '');
    }
    var orderType;
    if (!this.tableNumber) {
      console.log('switching to pickup')
      orderType = OrderType.EMPORTER;
      this.tableNumber = undefined;
    } else {
      orderType = OrderType.SUR_PLACE;
    }
    this.selectedOrderType = orderType;
    this.orderCacheService.setOrderType(orderType);
    if (orderType == OrderType.SUR_PLACE) {
      const tableNumber = this.orderCacheService.getTableNumber();
      console.log('[Resto Dash] - Table number:', this.tableNumber, tableNumber);
      if (this.tableNumber && (tableNumber == null || tableNumber == undefined)) {
        console.log("[Resto Dash] - Saving table number")
        this.orderCacheService.saveTableNumber(this.tableNumber, true);
      }
    } else {
      console.log("Not dining in")

    }
  }

  ngOnInit(): void {
    this.initializeDashboard();
    this.updateScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateScreenSize();
  }

  private updateScreenSize() {
    const screenWidth = window.innerWidth;
    this.isDesktopView = screenWidth > 1000;
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
            console.log('Active section:', this.activeSection); // Debugging log
          }
        });
      },
      { threshold: 0.6 } // Trigger when 60% of the section is visible
    );

    // Observe the native elements of the child components
    this.htmlSections.forEach((sectionComponent) => {
      const sectionElement = sectionComponent.sectionElement.nativeElement;
      console.log("Observing:", sectionElement.id);
      observer.observe(sectionElement);
    });
  }


  private initializeDashboard(): void {
    this.currentOrder = this.orderCacheService.getOrder(this.restaurantId);
    this.fetchRestaurantData(this.restaurantId)
      .then(() => this.fetchCategories(this.restaurantId))
      .then(() => this.fetchItems(this.restaurantId))
      .then(() => this.segments = this.getItemSegments())
      .catch((err) => {
        console.error('Error initializing dashboard:', err)
        this.isPageError = true;
      })
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
              }

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

  private fetchSections(restaurantId: string): Promise<void> {
    // this.clearOrder()
    return new Promise((resolve, reject) => {
      this.itemsService.getSections(restaurantId)
        .then((sections) => {
          this.itemsService.getItems(restaurantId, "COMPOUND")
            .then((items) => {
              const menuSection: Section = {
                name: 'Menus',
                items: items,
              };
              this.sections = [menuSection, ...sections];
              resolve();
            })
            .catch((err) => {
              console.error('Error fetching items:', err);
              reject(err);
            });
        })
        .catch((err) => {
          console.error('Error fetching sections:', err);
          reject(err);
        });
    });
  }


  private fetchItems(restaurantId: string, criteria?: GetAllItemsCriteria): Promise<void> {
    return new Promise((resolve, reject) => {
      this.itemsService.getItems(restaurantId, undefined, criteria).then((items) => {
        this.items = items;
        resolve();
      }).catch((err) => {
        console.error('Error fetching sections:', err);
        reject(err);
      });
    });
  }

  public getItemSegments(): Segment[] {
    return this.categories.map((
      category) => ({
        items: this.removeDuplicateItems(
          this.items.filter((item) => item.categories?.includes(category))
        ),
        name: category,
        segmentId: category,
      }))
      .filter((segment) => segment.items.length > 0)
      .sort((a, b) => this.sortSegments(a.name, b.name));
  }

  private removeDuplicateItems(items: IItem[]): IItem[] {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (!item.name) return true; // Keep items without a name
      const isDuplicate = seen.has(item.name);
      seen.add(item.name);
      return !isDuplicate;
    });
  }

  private sortSegments(nameA: string, nameB: string): number {
    const priority = { promotion: 1, menu: 2 };

    const getPriority = (name: string): number =>
      Object.entries(priority).find(([key]) =>
        name.toLowerCase().includes(key)
      )?.[1] || 3; // Default priority for other categories

    return getPriority(nameA) - getPriority(nameB);
  }

  public filterItemsByCriteria(criteria: GetAllItemsCriteria): void {
    this.isLoading = true
    this.fetchItems(this.restaurantId, criteria)
      .then(() => this.segments = this.getItemSegments())
      .catch((err) => console.error('Error initializing dashboard:', err))
      .finally(() => (this.isLoading = false));
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

  clearOrder(): void {
    this.currentOrder = [];
    this.orderCacheService.clearOrder();
    console.log('Order cleared.');
  }

  getOrderQuanity(): number {
    return this.currentOrder.reduce((total, item) => total + item.quantity, 0);
  }

  goToHome(): void {
    this.routingService.navigateToHome();
  }

  goToOrder(): void {
    this.routingService.navigateToCurrentOrderDetails(this.restaurantId, this.tableNumber);
  }

  goToOrdersView(): void {
    this.routingService.navigateToOrdersView(this.restaurantId, this.tableNumber);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOrderType(type: string): void {
    switch (type) {
      case OrderTypeString.SUR_PLACE:
        this.userInfoComponent.startScan();
        break;
      case OrderTypeString.EMPORTER:
        this.switchToPickup();
        break;
      default:
        console.error('Invalid order type:', type);
    }
    this.isDropdownOpen = false;
    this.orderCacheService.setOrderType(this.selectedOrderType);
    this.tableNumber = this.orderCacheService.getTableNumber() || undefined;
  }

  switchToDineIn(): void {
    this.userInfoComponent.startScan();
  }

  switchToPickup(): void {
    this.selectedOrderType = OrderType.EMPORTER;
    this.tableNumber = undefined;
  }

  onClickSearchFilter(): void {
    this.showFilterItemsForm = true;
  }
  closeContainer(): void {
    this.showFilterItemsForm = false;
  }

  getSelectedOrderType() {
    return getTypeString(this.selectedOrderType);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const filters = document.querySelector('.search');
    if (filters) {
      this.isSticky = filters.getBoundingClientRect().top === 0;
    }
  }


}
