import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  setAuthData(response: any): void {
  console.log("response")
  console.log(response)

    localStorage.setItem('authData', JSON.stringify(response));
  }

  getAuthData(): any {
    const authData = localStorage.getItem('authData');
    return authData ? JSON.parse(authData) : null;
  }

  getToken(): string | null {
    const authData = this.getAuthData();
    return authData ? authData.token : null;
  }

  getUserData(): any {
    const authData = this.getAuthData();
    return authData ? authData.user : null;
  }

  getHeaders() {
    const token = this.getToken();
    let headers = new HttpHeaders();

    if (token) {
      if (this.isTokenExpired()) {
        this.logout();
        throw new Error("Token expiré. Redirection vers la connexion.");
      }
      headers = headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  setUserData(updatedUserData: any): void {
    const authData = this.getAuthData();
  
    if (authData) {
      authData.user = {
        restaurantId: updatedUserData.restaurantId,
        restaurantName: updatedUserData.name,
        restaurantAddress: updatedUserData.address,
        restaurantSiret: updatedUserData.siret,
        restaurantTva: updatedUserData.tva,
        restaurantPicture: updatedUserData.illustration,
        firstName: updatedUserData.admin.firstName,
        lastName: updatedUserData.admin.lastName,
        email: updatedUserData.admin.email,
        phone: updatedUserData.admin.phoneNumber,
        illustration: updatedUserData.admin.illustration
      };
  
      localStorage.setItem('authData', JSON.stringify(authData));
    } else {
      console.warn('No auth data found to update user data.');
    }
  }  

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const expiryDate = this.getTokenExpiry(token);
    return expiryDate < new Date();
  }

  private getTokenExpiry(token: string): Date {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTimestamp = payload.exp * 1000;
    return new Date(expiryTimestamp);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null && !this.isTokenExpired();
  }

  logout(): void {
    localStorage.removeItem('authData');
    this.router.navigate(['/account/login']);
  }
}
