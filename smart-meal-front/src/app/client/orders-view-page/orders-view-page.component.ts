import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IItem } from 'src/domain/model/IItem';
import { Restaurant } from 'src/domain/model/Restaurant';
import { Section } from 'src/domain/model/Section';
import { Location } from '@angular/common';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';
import { OrderedItem } from 'src/domain/model/Aside';
import { OrdersService } from 'src/domain/service/OrderService';
import { Order, OrderStatus } from 'src/domain/model/Order';
import { RoutingService } from 'src/app/services/routing.service';
import { ActivatedRoute } from '@angular/router';
import { OrderType, OrderTypeString } from 'src/domain/model/OrderType';
import FingerprintJS from "@fingerprintjs/fingerprintjs";

@Component({
  selector: 'app-orders-view-page',
  templateUrl: './orders-view-page.component.html',
  styleUrls: ['./orders-view-page.component.scss'],
})
export class OrdersViewPageComponent implements OnInit, AfterViewInit {
  public restaurant: Restaurant | undefined;
  public sections: Section[] = [];
  public searchedItems: IItem[] = [];
  public currentOrder: OrderedItem[] = [];
  public isLoading: boolean = true;
  public isError: boolean = true;
  public restaurantId: string;
  public tableNumber?: number;
  public customerName: string | null;
  public orders: Order[] = [];
  public singleOrder!: Order;
  public isEditingName: boolean = false;
  public orderType: string | null = null;
  public orderId: string | null = null;
  public orderPrice: number | null = null;
  public errorMessage: string | null = null;
  public orderNotFound: boolean = false;
  editedOrderId: string[] = ["", "", "", "", ""];
  currentIndex: number = 0;
  OrderType = OrderType;
  OrderTypeString = OrderTypeString;
  public fingerprint?: string;

  @ViewChildren('inputElement') inputs!: QueryList<ElementRef>;


  constructor(
    private routingService: RoutingService,
    private ordersService: OrdersService,
    private location: Location,
    private orderCacheService: OrderCacheService,
  ) {
    this.increaseOrderQuantity = this.increaseOrderQuantity.bind(this);
    this.decreaseOrderQuantity = this.decreaseOrderQuantity.bind(this);
    const restaurantId = this.routingService.getRestaurantIdFromRoute();
    this.tableNumber = this.routingService.getTableNumberFromRoute();
    if (!restaurantId) {
      this.routingService.navigateToHome();
      this.restaurantId = '';
      this.tableNumber = -1;
    } else {
      this.restaurantId = restaurantId;
    }
    this.customerName = this.orderCacheService.getCustomerName();
  }

  async ngOnInit() {
    this.orderType = OrderTypeString.SUR_PLACE;
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    this.fingerprint = this.orderCacheService.getUserFingerprint() ?? undefined;
    if(this.fingerprint) {
      this.fetchTableOrders();
    } else {
      this.isError = true;
    }

    // if (this.orderType === OrderTypeString.EMPORTER) {
    //   const state = window.history.state;
    //   this.orderId = state['orderId'] || null;
    //   console.log('order info:', this.orderId, state);
    //   if (this.orderId) {
    //     this.fetchOrderById(this.restaurantId, this.orderId);
    //   } else {
    //     this.isLoading = false;
    //   }
    // } else if (this.orderType === OrderTypeString.SUR_PLACE) {
    //   this.fetchTableOrders();
    //   console.log("fecthing orders")
    // }
  }

  ngAfterViewInit(): void { }


  // Only for Dine-In orders
  private fetchOrders(restaurantId: string): Promise<void> {
    const cachedTableDate = this.orderCacheService.getTableInfoTimestamp();
    return new Promise((resolve, reject) => {
      this.customerName && this.ordersService.getAllOrders(
        restaurantId,
        {
          customerName: this.customerName,
          userFingerprint: this.fingerprint,
          tableNumber: this.tableNumber,
        })
        .then((data) => {
          // Tri des commandes par orderId décroissant
          this.orders = data.sort((a, b) => (b.orderId ?? 0) - (a.orderId ?? 0));
          console.log(data);
        })
        .catch((err) => {
          console.error('Error fetching items:', err);
        })
        .finally(() => {
          this.isLoading = false;
          resolve();
        });
    });
  }  


  // Only for Takeaway orders
  private fetchOrderById(restaurantId: string, orderId: string): void {
    this.isLoading = true;
    this.orderNotFound = false; // Reset error state
    this.errorMessage = null;

    this.ordersService.getAllOrders(restaurantId, { orderId: parseInt(orderId) })
      .then((data) => {

        if (data && data.length > 0) {
          console.log("order found")
          console.log(data)
          this.singleOrder = data[0];
        } else {
          console.log("order not found")
          this.orderNotFound = true;
          //this.singleOrder = undefined;
        }
      })
      .catch((err) => {
        console.error('Error fetching order:', err);
        this.orderNotFound = true;
        //this.singleOrder = undefined;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }


  fetchTableOrders() {
    this.fetchOrders(this.restaurantId)
      .catch((err) => console.error('Error fetching table orders:', err))
      .finally(() => (this.isLoading = false));
  }

  navigateBack(): void {
    this.routingService.navigateToRestaurantDashboard(this.restaurantId, this.tableNumber);
  }

  getItemById(itemId: string): IItem {
    return this.searchedItems.find((item) => item.itemId === itemId) || {
      itemId: '',
      name: '',
      price: 0,
      type: '',
      ingredients: []
    };
  }

  calculatePrice(): number {
    let sum = 0;
    this.currentOrder.map((orderItem => sum += (orderItem.price * orderItem.quantity)));
    return sum;
  }

  clearOrder() {
    this.orderCacheService.clearOrder();
    this.location.back();
  }

  // async confirmOrder() {
  //   const chosenItems: OrderItemInput[] = mapOrderedItemsToOrderInputs(this.currentOrder);
  //   const orderObject: CreateOrderInput = {
  //     username: "",
  //     phone: "string",
  //     orderDate: new Date().toISOString(),
  //     chosenItems,
  //     restaurantId: parseInt(this.restaurantId),
  //     tableNumber: this.tableNumber,
  //   }
  //   console.log("creating order");
  //   const orderId = await this.ordersService.createOrder(orderObject);
  //   const orderPrice = this.calculatePrice();
  //   this.routingService.navigateToItemPayment(this.restaurantId, this.tableNumber, orderId, orderPrice);
  //   // navigate to customer/item-payment and send orderId and orderPrice as state
  //   // this.clearOrder();
  // }

  increaseOrderQuantity(itemId: string): void {
    const orderItem = this.currentOrder.find(item => item.itemId === itemId);
    if (orderItem) {
      orderItem.quantity++;
      this.orderCacheService.saveOrder(this.currentOrder);
    }
  }

  decreaseOrderQuantity(itemId: string): void {
    const orderItem = this.currentOrder.find(item => item.itemId === itemId);
    if (orderItem && orderItem.quantity > 0) {
      orderItem.quantity--;
      if (orderItem.quantity === 0) {
        this.currentOrder = this.currentOrder.filter(item => item.itemId !== itemId);
      }
      this.orderCacheService.saveOrder(this.currentOrder);
    }
  }

  startEditingName(): void {
    this.isEditingName = true;
  }

  finishEditingName(): void {
    this.isEditingName = false;
    this.customerName && this.orderCacheService.saveCustomerName(this.customerName);
  }

  addToOrder = (order: Order): void => {
    // const orderItems = order.chosenItems.map(item => ({
    //   itemId: item.itemId,
    //   quantity: 1,
    //   price: 0
    // }));
    // this.currentOrder.push(...orderItems);
    // this.orderCacheService.saveOrder(this.currentOrder);
  }

  getIncompleteOrders(): Order[] {
    const ret = this.orders.filter(order => order.status !== OrderStatus.DONE);
    // console.log(ret)
    return ret;
  }

  getCompleteOrders(): Order[] {
    const ret = this.orders.filter(order => order.status === OrderStatus.DONE);
    // console.log(ret)
    return ret;
  }



  onInput(index: number, event: any) {
    const value = event.value;
    if (value.match(/^[0-9]$/)) {
      if (index < this.editedOrderId.length - 1) {
        this.currentIndex = index + 1;
        this.inputs.toArray()[index + 1].nativeElement.focus();
      }
    } else {
      this.editedOrderId[index] = ""; // Empêche l'entrée invalide
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === "Backspace") {
      if (this.editedOrderId[index]) {
        this.editedOrderId[index] = ""; // Supprime le chiffre actuel
      } else if (index > 0) {
        this.currentIndex = index - 1;
        this.inputs.toArray()[index - 1].nativeElement.focus();
      }
    }
  }
  submitOrderId() {
    const finalOrder = this.editedOrderId.join("");
    console.log("Numéro de commande :", finalOrder);
    this.fetchOrderById(this.restaurantId, finalOrder);
  }

  getSingleOrder() {
    return this.orders[0];
  }

  // submitOrderId(orderId: string) {
  //   //const orderId = this.orderNumbers[this.selectedIndex];
  //   this.fetchOrderById(this.restaurantId, orderId);
  // }
}
