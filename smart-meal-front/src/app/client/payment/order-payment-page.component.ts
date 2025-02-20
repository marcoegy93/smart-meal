import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { CreateOrderInput } from 'src/domain/model/input/CreateOrderInput';
import { OrdersService } from 'src/domain/service/OrderService';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';


@Component({
  selector: 'app-order-payment-page',
  templateUrl: './order-payment-page.component.html',
  styleUrls: ['./order-payment-page.component.scss'],
})
export class OrderPaymentPageComponent implements OnInit, AfterViewInit {
  orderData: CreateOrderInput | null = null;
  public restaurantId: string;
  public tableNumber?: number;
  showTerminalModal: boolean = false;

  constructor(
    private routingService: RoutingService, 
    private orderCacheService: OrderCacheService,
    private ordersService: OrdersService
  ) {
    const restaurantId = this.routingService.getRestaurantIdFromRoute();
    this.tableNumber = this.routingService.getTableNumberFromRoute();
    if (!restaurantId) {
      this.routingService.navigateToHome();
      this.restaurantId = '';
    } else {
      this.restaurantId = restaurantId;
    }
    // Bind des méthodes
    this.onPaymentSuccess = this.onPaymentSuccess.bind(this);
    this.onCancelPayment = this.onCancelPayment.bind(this);
    this.payAtTerminal = this.payAtTerminal.bind(this);
  }

  ngOnInit(): void {
    const state = window.history.state;
    console.log('State:', state); // Pour le debug
    this.orderData = state?.orderData || null;
  }

  ngAfterViewInit(): void { }


  async payAtTerminal(): Promise<void> {
    console.log('Paying at terminal...'); // Pour le debug
    if (this.orderData) {
      try {
        this.orderData.orderId = await this.ordersService.createOrder(this.orderData);
        this.showTerminalModal = true;
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
  }

  closeTerminalModal(): void {
    this.showTerminalModal = false;
    this.orderCacheService.clearOrder();
    this.routingService.navigateToOrdersView(this.restaurantId, this.tableNumber, this.orderData?.orderId);
  }

  async onPaymentSuccess(): Promise<void> {
    console.log('Payment success...'); // Pour le debug
    if (this.orderData) {
      try {
        this.orderCacheService.clearOrder();
        const orderType = this.orderCacheService.getOrderType();
        if (orderType === 'A emporter') {
          this.routingService.navigateToOrdersView(this.restaurantId, this.tableNumber, this.orderData.orderId);
        } else {
          this.routingService.navigateToOrdersView(this.restaurantId, this.tableNumber, undefined);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
      }
    }
  }

  onCancelPayment(): void {
    console.log('Payment cancelled!');
    this.routingService.navigateToCurrentOrderDetails(this.restaurantId, this.tableNumber);
  }
}
