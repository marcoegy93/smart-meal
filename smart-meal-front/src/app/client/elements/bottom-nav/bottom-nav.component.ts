import { Component, Input } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';

@Component({
    selector: 'app-bottom-nav',
    templateUrl: './bottom-nav.component.html',
    styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
    @Input() cartItemCount: number = 0;
    @Input() restaurantId: string = '';
    @Input() tableNumber?: number;

    constructor(
        private routingService: RoutingService,
        private orderCacheService: OrderCacheService,
    ) { }



    goToHome(): void {
        this.routingService.navigateToHome();
    }

    goToOrder(): void {
        this.routingService.navigateToCurrentOrderDetails(this.restaurantId, this.tableNumber);
    }

    goToOrdersView(): void {
        this.routingService.navigateToOrdersView(this.restaurantId, this.tableNumber);
    }
} 