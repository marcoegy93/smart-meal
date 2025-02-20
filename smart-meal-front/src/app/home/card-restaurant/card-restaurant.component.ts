import { Component, Input, OnInit } from '@angular/core';
import { Restaurant } from 'src/domain/model/Restaurant';
import { ImageValidityService } from 'src/app/services/image-validity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-restaurant',
  templateUrl: './card-restaurant.component.html',
  styleUrls: ['./card-restaurant.component.scss']
})
export class CardRestaurantComponent implements OnInit {
  @Input()
  restaurant!: Restaurant;

  isImageValid: boolean = false;

  constructor(
  private router: Router,
  private imageValidityService: ImageValidityService,
  ) {}

    navigateToRestaurantDetail() {
        this.router.navigate(['/customer/restaurant'], { queryParams: { restaurantId: this.restaurant.restaurantId } });
  }

  ngOnInit() {
    this.imageValidityService
      .checkImageValidity(this.restaurant?.illustration)
      .then((isValid) => (this.isImageValid = isValid));
  }
}
