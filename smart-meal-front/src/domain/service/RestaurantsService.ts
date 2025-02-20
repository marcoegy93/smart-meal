import { Injectable } from "@angular/core";
import { Restaurant } from "../model/Restaurant";
import { Restaurants } from "../external/Restaurants";
import { UserKitchen } from "../model/UserKitchen";
import { UserToken } from "../model/UserToken";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  constructor(private restaurant: Restaurants) {
  }

  async getRestaurant(restaurantId: string){
    return await this.restaurant.getRestaurant(restaurantId);
  }

  async getSections(restaurantToCreate: Restaurant) {
    return await this.restaurant.createOrUpdateRestaurant(restaurantToCreate)
  }

  async updateRestaurant(restaurantId: string, restaurantToUpdate: Restaurant){
    return await this.restaurant.updateRestaurant(restaurantId, restaurantToUpdate);
  }

  async getUserKitchen(restaurantId: string){
    return await this.restaurant.getUserKitchen(restaurantId);
  }

  async updateUserKitchen(userKitchenId: string, userToUpdate: UserKitchen){
    return await this.restaurant.updateUserKitchen(userKitchenId, userToUpdate);
  }

  async getRestaurants(): Promise<Restaurant[]> {
    try {
      return await this.restaurant.getAllRestaurants();
    }catch (e) {
      throw e;
    }
  }

  async login(email: string, password: string): Promise<UserToken> {
    try {
      return await this.restaurant.login(email, password);
    }catch (e) {
      throw e;
    }
  }

  async createOrUpdateRestaurant(restaurant: Restaurant) {
    try {
      console.log(restaurant);
      await this.restaurant.createOrUpdateRestaurant(restaurant);
    }catch (e) {
      throw e;
    }
  }

}
