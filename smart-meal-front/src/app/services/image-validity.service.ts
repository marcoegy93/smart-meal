import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageValidityService {
  constructor() {}

  checkImageValidity(imageUrl: string | null | undefined): Promise<boolean> {
    return new Promise((resolve) => {
      if (!imageUrl) {
        resolve(false);
        return;
      }

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }
}