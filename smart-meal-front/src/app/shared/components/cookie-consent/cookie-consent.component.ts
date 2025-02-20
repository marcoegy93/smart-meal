import { Component } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent {
  public isVisible = true;

  acceptCookies(): void {
    localStorage.setItem('cookieConsent', 'accepted');
    this.isVisible = false;
  }

  refuseCookies(): void {
    localStorage.setItem('cookieConsent', 'refused');
    this.isVisible = false;
  }

  ngOnInit(): void {
    const consent = localStorage.getItem('cookieConsent');
    this.isVisible = !consent;
  }
} 