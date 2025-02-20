import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface Error {
  message?: string;
  type?: string
  additionalDetails?: string[]
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public currentError: BehaviorSubject<Error | undefined> = new BehaviorSubject<Error | undefined>(undefined);
  public hasError: boolean = false

  constructor() { }

  public send(error: Error){
    this.currentError.next(error)
    this.hasError = true
  }

  static getAnError(message: string, additionalDetails?: string[]): Error {
    return {
      type: "ERROR",
      message: message,
      additionalDetails: additionalDetails
    }
  }

  static getAnInfo(message: string, additionalDetails?: string[]){
    return {
      type: "INFO",
      message: message,
      additionalDetails: additionalDetails
    }
  }

}
