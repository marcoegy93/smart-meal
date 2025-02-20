import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/domain/service/notification.service';
import { RestaurantsService } from 'src/domain/service/RestaurantsService';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { Restaurant } from 'src/domain/model/Restaurant';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  settingsForm: FormGroup;
  isLoading = false;
  selectedRestaurantFile: File | null = null;
  selectedAdminFile: File | null = null;
  selectedFilePreviewRestaurant: string | undefined;
  selectedFilePreviewAccount: string | undefined;

  currentStep: string = 'restaurant';
  steps: string[] = ['restaurant', 'admin'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private restaurantService: RestaurantsService,
    private firebaseStorageService: FirebaseStorageService
  ) {
    this.settingsForm = this.fb.group({
      restaurantName: [''],
      street: [''],
      postalCode: [''],
      city: [''],
      restaurantSiret: [''],
      restaurantTva: [''],
      lastName: [''],
      firstName: [''],
      email: [''],
      phone: [''],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const userData = this.authService.getUserData();

    if (userData) {
      const addressParts = this.splitAddress(userData.restaurantAddress || '');

      this.settingsForm.patchValue({
        restaurantName: userData.restaurantName || '',
        street: addressParts.street || '',
        postalCode: addressParts.postalCode || '',
        city: addressParts.city || '',
        lastName: userData.lastName || '',
        firstName: userData.firstName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        restaurantSiret: userData.restaurantSiret || '',
        restaurantTva: userData.restaurantTva || ''
      });

      this.selectedFilePreviewRestaurant = userData.restaurantPicture || null;
      this.selectedFilePreviewAccount = userData.illustration || null;

    } else {
      this.notificationService.send(
        NotificationService.getAnInfo('Pas de données utilisateur trouvées', [])
      );
    }
  }

  private splitAddress(address: string): { street: string; postalCode: string; city: string } {
    const regex = /^(.*),\s*(\d{5})\s*(.*)$/;
    const match = regex.exec(address);

    if (match) {
      return {
        street: match[1].trim(),
        postalCode: match[2].trim(),
        city: match[3].trim()
      };
    }

    return { street: address, postalCode: '', city: '' };
  }

  onRestaurantPictureSelected(file: File | null): void {
    if (file) {
      this.selectedRestaurantFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFilePreviewRestaurant = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedRestaurantFile = null;
      this.selectedFilePreviewRestaurant = undefined;
    }
  }
  
  onAdminPictureSelected(file: File | null): void {
    if (file) {
      this.selectedAdminFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFilePreviewAccount = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedAdminFile = null;
      this.selectedFilePreviewAccount = undefined;
    }
  }  

  async submit(): Promise<void> {
    if (this.settingsForm.valid) {
      this.isLoading = true;

      const formValue = { ...this.settingsForm.value };
      formValue.restaurantAddress = `${formValue.street}, ${formValue.postalCode} ${formValue.city}`;

      try {
        // Téléversement des images vers Firebase Storage
        let restaurantImageUrl = this.selectedFilePreviewRestaurant || '';
        let adminImageUrl = this.selectedFilePreviewAccount || '';

        if (this.selectedRestaurantFile) {
          const filePath = `restaurant-images/${Date.now()}_${this.selectedRestaurantFile.name}`;
          restaurantImageUrl = await this.firebaseStorageService.uploadFile(this.selectedRestaurantFile, filePath);
        }

        if (this.selectedAdminFile) {
          const filePath = `admin-images/${Date.now()}_${this.selectedAdminFile.name}`;
          adminImageUrl = await this.firebaseStorageService.uploadFile(this.selectedAdminFile, filePath);
        }

        // Construire l'objet Restaurant
        const updateData: Restaurant = {
          name: formValue.restaurantName,
          address: formValue.restaurantAddress,
          siret: formValue.restaurantSiret,
          tva: formValue.restaurantTva,
          restaurantId: this.authService.getUserData().restaurantId,
          illustration: restaurantImageUrl,
          admin: {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email,
            phoneNumber: formValue.phone,
            illustration: adminImageUrl
          }
        };

        // Appel au service pour mettre à jour les données
        await this.restaurantService.createOrUpdateRestaurant(updateData);

        this.authService.setUserData(updateData);
        window.location.reload();
        this.notificationService.send(
          NotificationService.getAnInfo('Settings updated successfully', [])
        );
      } catch (error) {
        console.error('Failed to update settings:', error);
        this.notificationService.send(
          NotificationService.getAnInfo('Failed to update settings', [])
        );
      } finally {
        this.isLoading = false;
      }
    }
  }

  goTo(step: string) {
    if (this.canNavigateToStep(step)) {
      this.currentStep = step;
    }
  }

  nextStep() {
    const currentIndex = this.steps.indexOf(this.currentStep);
    if (currentIndex < this.steps.length - 1) {
      // Valider l'étape actuelle avant de passer à la suivante
      if (this.validateCurrentStep()) {
        this.currentStep = this.steps[currentIndex + 1];
      }
    }
  }

  previousStep() {
    const currentIndex = this.steps.indexOf(this.currentStep);
    if (currentIndex > 0) {
      this.currentStep = this.steps[currentIndex - 1];
    }
  }

  private validateCurrentStep(): boolean {
    if (this.currentStep === 'restaurant') {
      const restaurantControls = ['restaurantName', 'street', 'postalCode', 'city', 'restaurantSiret', 'restaurantTva'];
      const isValid = restaurantControls.every(control => 
        !this.settingsForm.get(control)?.errors
      );

      if (!isValid) {
        this.notificationService.send(
          NotificationService.getAnError('Veuillez remplir correctement tous les champs du restaurant', [])
        );
      }
      return isValid;
    }
    return true;
  }

  canNavigateToStep(step: string): boolean {
    const targetIndex = this.steps.indexOf(step);
    const currentIndex = this.steps.indexOf(this.currentStep);
    return targetIndex <= currentIndex || this.validateCurrentStep();
  }
}
