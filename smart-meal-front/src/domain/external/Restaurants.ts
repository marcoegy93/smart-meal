import {GetAllItemsCriteria} from "../model/input/GetAllItemsCriteria";
import {Section} from "../model/Section";
import {Restaurant} from "../model/Restaurant";
import {UserKitchen} from "../model/UserKitchen";
import {Observable} from "rxjs";
import { UserToken } from "../model/UserToken";

export abstract class Restaurants {
  abstract login(email: string, password: string): Promise<UserToken>
  abstract getRestaurant(restaurantId: string): Observable<Restaurant>
  abstract getAllRestaurants(): Promise<Restaurant[]>
  abstract createOrUpdateRestaurant(restaurantToCreate: Restaurant): Promise<void>
  abstract updateRestaurant(restaurantId: string, restaurantToUpdate: Restaurant): void
  abstract getUserKitchen(restaurantId: string): Observable<UserKitchen[]>
  abstract updateUserKitchen(userKitchenId: string, userToUpdate: UserKitchen): Observable<UserKitchen[]>
}
