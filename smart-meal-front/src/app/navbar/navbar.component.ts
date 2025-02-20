import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public isLoggedIn: boolean = false;
  public userName: string | null = null;
  public userIllustration: string | null = null;
  public showDeconnexionConfirmation: boolean = false;
  constructor(private authService: AuthService) { }

  checkUserStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const userData = this.authService.getUserData();
      this.userName = userData ? `${userData.firstName} ${userData.lastName}` : null;
      this.userIllustration = userData ? userData.illustration : null;

      if (this.userIllustration) {
        if (!this.userIllustration.includes('firebasestorage')) {
          this.userIllustration = null;
        }
      }
      
      console.log(this.userIllustration)
      console.log("this.userIllustration")

    }
  }

  confirmDeconnexion(): void {
    this.authService.logout();
  }

  cancelDeconnexion(): void {
    this.showDeconnexionConfirmation = false;
  }

  requestDeconnexion(): void {
    this.showDeconnexionConfirmation = true;
  }

  ngOnInit(): void {
    this.setupNavbarInteraction();
    this.checkUserStatus();
  }

  setupNavbarInteraction(): void {
    const body = document.querySelector('body');
    const burger = document.querySelector('.burger') as HTMLElement;
    const menu = document.querySelector('.menu-list') as HTMLElement;
    const navbar = document.querySelector('.navbar') as HTMLElement;

    if (burger && menu) {
      burger.onclick = () => {
        menu.classList.toggle('active');
        body?.classList.toggle('disabledScroll');
        burger.classList.toggle('active');
      };
    }

    window.onscroll = () => {
      if (window.scrollY > 0) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    };
  }
}