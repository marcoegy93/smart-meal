import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { RoutingService } from 'src/app/services/routing.service';
import { I } from '@angular/cdk/keycodes';
import { OrderTypeString } from 'src/domain/model/OrderType';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
    @Input() restaurantId!: string;
    @Input() startQrScanner!: boolean;
    showQrCodeScanner: boolean = false;
    public tableNumber: number | undefined;
    public customerName: string | null;
    public isEditingName: boolean = false;
    isScanning: boolean = false;
    private html5QrCode!: Html5Qrcode;
    activeTab: 'qr' | 'manual' = 'qr';
    manualTableNumber: number | null = null;
    @Input() onChangeCustomerName: (name: string) => void = () => { };
    @Input() onChangeTableNumber: (tableNumber: number) => void = () => { };
    public orderType: string;
    OrderTypeString = OrderTypeString;

    constructor(
        private routingService: RoutingService,
        private orderCacheService: OrderCacheService,
    ) {
        this.tableNumber = this.routingService.getTableNumberFromRoute();
        console.log("Table number is: ", this.tableNumber);

        // if (!this.tableNumber) {
        //     this.showQrCodeScanner = true;
        // }

        this.customerName = this.orderCacheService.getCustomerName();
        this.orderType = this.orderCacheService.getOrderType();
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     console.log("Changes: ");
    //     console.log(changes);
    // }

    startEditingName(): void {
        this.isEditingName = true;
    }

    finishEditingName(): void {
        this.isEditingName = false;
        this.customerName && this.orderCacheService.saveCustomerName(this.customerName);
    }

    startScan() {
        console.log(this.startQrScanner)
        console.log("Starting QR scanner");
        this.showQrCodeScanner = true;
        if (!this.html5QrCode) {
            this.html5QrCode = new Html5Qrcode("reader");
        }

        this.isScanning = true;

        this.html5QrCode.start(
            { facingMode: "environment" }, // Use back camera
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                console.log(`QR Code detected: ${decodedText}`);
                this.html5QrCode.stop();
                this.isScanning = false;
                window.location.href = decodedText;
            },
            (errorMessage) => {
                // console.warn(errorMessage);
            }
        ).catch((err) => {
            console.error(`Error starting the QR scanner: ${err}`);
        });
    }

    ngOnDestroy() {
        this.closeScanner()
    }

    closeScanner(): void {
        this.showQrCodeScanner = false;

        if (this.html5QrCode) {
            console.log("Stopping QR scanner");
            console.log(this.html5QrCode);

            // Ensure the scanner is running before stopping
            if (this.html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
                this.html5QrCode
                    .stop()
                    .then(() => console.log("QR scanner stopped successfully"))
                    .catch(err => console.error("Error stopping the QR scanner:", err));
            } else {
                console.log("QR scanner is not running, no need to stop.");
            }
        }
        this.setActiveTab('qr')
    }


    setActiveTab(tab: 'qr' | 'manual') {
        this.activeTab = tab;
    }

    submitManualTableNumber() {
        if (this.manualTableNumber) {
            this.onSuccessfulScan(this.manualTableNumber.toString());
            this.manualTableNumber = null;
        }
    }

    onSuccessfulScan(tableNumber: string) {
        console.log('Table number:', tableNumber);
        this.orderCacheService.saveTableNumber(parseInt(tableNumber, 10));
        const url = `/customer/restaurant?restaurantId=${this.restaurantId}&tableNumber=${tableNumber}`;
        console.log('Navigating to:', url);

        window.location.href = url;

        //this.routingService.navigateToRestaurantDashboard(this.restaurantId, parseInt(tableNumber, 10));
        this.closeScanner();
    }
}
