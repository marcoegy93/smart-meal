import { Injectable } from '@angular/core';
import { RestApiProvider } from 'src/infra/rest/RestApiProvider';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SalesAndRevenueService {

     constructor(
        private provider: RestApiProvider,
        private authService: AuthService,
        private router: Router
      ) {
      }

    async getSalesFromDate(fromDate: Date, restaurantId : number) {
          try {
              const stringDate = this.convertDateToString(fromDate)
              const path = `restaurant/SalesAndRevenue/${restaurantId}/${stringDate}`;
              const headers = this.getHeaders();
              return await  this.provider.get<any>(path, undefined, headers);
            } catch (e) {
              console.log(e);
              return null
      }
    }

  private convertDateToString(date: Date): String {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
      const year = String(date.getFullYear()); // Prendre l'année complète

      return `${month}-${day}-${year}`;
  }

  private getHeaders() {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      if (this.authService.isTokenExpired()) {
        this.authService.logout();
        throw new Error("Token expiré. Redirection vers la connexion.");
      }
      headers = headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

}
