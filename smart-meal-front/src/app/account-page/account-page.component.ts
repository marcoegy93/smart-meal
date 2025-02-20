import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  isLoginPage: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateIsLoginPage();

    this.router.events.subscribe(() => {
      this.updateIsLoginPage();
    });
  }

  private updateIsLoginPage(): void {
    this.isLoginPage = this.router.url.includes('/account/login');
  }
}
