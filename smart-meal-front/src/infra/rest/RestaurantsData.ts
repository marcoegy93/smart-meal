import {from,Observable} from "rxjs";
import {Restaurant} from "src/domain/model/Restaurant";
import {UserKitchen} from "src/domain/model/UserKitchen";
import {Restaurants} from "../../domain/external/Restaurants";
import {Injectable} from "@angular/core";
import {RestApiProvider} from "./RestApiProvider";
import { UserToken } from "src/domain/model/UserToken";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsData extends Restaurants {

  constructor(private provider: RestApiProvider) {
    super();
  }

 getRestaurant(restaurantId: string): Observable<Restaurant> {
  const path = `Restaurant/${restaurantId}`;
  const promise = this.provider.get<Restaurant>(path);
  return from(promise);
}


  async getAllRestaurants(): Promise<Restaurant[]> {
    const path = "Restaurant/getAllRestaurants";
    try {
      return await this.provider.get<Restaurant[]>(path);
    }catch (error) {
      console.log(error);
      return []
    }
  }

  async login(email: string, password: string): Promise<UserToken> {
    try {
      const path = "Restaurant/Authentification";
      return await this.provider.post<UserToken>(path, { email, password });
    } catch (e) {
      throw e;
    }
  }

  async createOrUpdateRestaurant(restaurantToCreate: Restaurant): Promise<void> {
    try {
      const path = "Restaurant";
      await this.provider.patch<any>(path, restaurantToCreate);
    }catch (e) {
      throw e
    }
  }

  updateRestaurant(restaurantId: string, restaurantToUpdate: Restaurant): void {
    throw new Error("Method not implemented.");
  }

  getUserKitchen(restaurantId: string): Observable<UserKitchen[]> {
    throw new Error("Method not implemented.");
  }

  updateUserKitchen(userKitchenId: string, userToUpdate: UserKitchen): Observable<UserKitchen[]> {
    throw new Error("Method not implemented.");
  }

}
