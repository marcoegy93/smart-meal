import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'container-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  restaurantName: string | null = null;
  userName: string | null = null;
  restaurantAddress: string | null = null;
  userIllustration: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const userData = this.authService.getUserData();

    if (userData) {
      this.restaurantName = userData.restaurantName;
      this.userName = userData.firstName + " " + userData.lastName;
      this.restaurantAddress = userData.restaurantAddress;
      this.userIllustration = userData.illustration;
    }
  }

  goToSettings(): void {
    this.router.navigate(['/administration/setting']);
  }
}
