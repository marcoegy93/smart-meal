import { Injectable } from '@angular/core';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {

  constructor(private firebaseService: FirebaseService) {}

  async uploadFile(file: File, filePath: string): Promise<string> {;
    const storageRef = ref(this.firebaseService.getStorage(), filePath);

    try {
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('File uploaded successfully:', uploadResult);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  async uploadPdfContract(pdfBlob: Blob, siret: string): Promise<string> {
    const filePath = `contracts/${siret}_${new Date().getTime()}.pdf`;
    const file = new File([pdfBlob], filePath.split('/').pop() || 'contract.pdf', { type: 'application/pdf' });
    return this.uploadFile(file, filePath);
  }
}
