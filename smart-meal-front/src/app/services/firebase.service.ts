import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  private firebaseApp;
  public storage;

  constructor() {
    this.firebaseApp = initializeApp(environment.firebase);
    this.storage = getStorage(this.firebaseApp);
  }

  getStorage() {
    return this.storage;
  }
}
