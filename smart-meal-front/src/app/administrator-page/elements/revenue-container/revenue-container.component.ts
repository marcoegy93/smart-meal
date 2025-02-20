import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, Color } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { SalesAndRevenueService } from 'src/app/services/sales-and-revenue.service';
import { SalesAndRevenue } from 'src/domain/model/SalesAndRevenue';

@Component({
  selector: 'app-revenue-container',
  templateUrl: './revenue-container.component.html',
  styleUrl: './revenue-container.component.scss'
})
export class RevenueContainerComponent implements OnInit {

  dateFrom: Date =new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  salesAndRevenueList: SalesAndRevenue [] = []
  totalPrice: string = '0,00'
  restaurantId: number = 0
  width: number = 520;
  colorScheme: any = {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: ['#ff5c5c']
  };

  public hasData: boolean = false;

  constructor(private readonly salesAndRevenueService: SalesAndRevenueService,
    private readonly authService: AuthService
  ){}

  async ngOnInit() {
    this.restaurantId = this.authService.getUserData().restaurantId;
    this.getListSales()
    this.calculateWidth();
    window.addEventListener('resize', () => {
      this.calculateWidth();
    });
  }

  async getListSales(){
    this.salesAndRevenueList = []
    this.salesAndRevenueList = await this.salesAndRevenueService.getSalesFromDate(this.dateFrom, this.restaurantId);
    this.hasData = this.salesAndRevenueList.length > 0;
    
    if (this.hasData) {
      this.getTotalPrice()
      this.processSalesAndRevenue()
      this.chartData = [
        {
          name: "Chiffre du jour",
          series: this.groupedSales,
          fill: true,
          fillOpacity: 0.3
        }
      ]
    } else {
      this.totalPrice = '0,00';
      this.chartData = [];
    }
  }

  getTotalPrice(): void {
    const total = this.salesAndRevenueList.reduce((sum, item) => sum + item.price, 0);
    this.totalPrice = total.toFixed(2).replace('.', ','); 
  }

  onDateChange(newDate: Date): void {
    this.getListSales()
  }

  chartData: { name: string; series: { name: string; value: number; }[], fill:boolean, fillOpacity: number }[] | undefined 
  groupedSales: { name: string, value: number }[] = [];


  processSalesAndRevenue() {
    const sortedList = this.salesAndRevenueList.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return dateA - dateB;
    });

    const dateGroupMap: { [key: string]: number } = {};

    sortedList.forEach(sale => {
      const dateKey = this.formatDate(sale.orderDate);
      if (!dateGroupMap[dateKey]) {
        dateGroupMap[dateKey] = 0;
      }
      dateGroupMap[dateKey] += sale.price;
    });

    this.groupedSales = Object.keys(dateGroupMap).map(date => ({
      name: date,
      value: dateGroupMap[date]
    }));
  }

  formatDate(date: Date): string {
    const d = new Date(date); 
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }  

  private calculateWidth() {
    const container = document.querySelector('.right-panel') as HTMLElement;
    if (container) {
      this.width = container.clientWidth - 32; // 16px padding de chaque côté
    }
  }
}
