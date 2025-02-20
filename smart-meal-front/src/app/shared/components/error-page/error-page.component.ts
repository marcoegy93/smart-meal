import { Component, Input } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent {

    @Input() errorMessage!: string;

    constructor(private routingService: RoutingService) { }

    goHome() {
        this.routingService.navigateToHome();
    }
} 