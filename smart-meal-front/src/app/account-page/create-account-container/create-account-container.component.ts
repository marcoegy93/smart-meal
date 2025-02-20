import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Restaurant } from "../../../domain/model/Restaurant";
import { Administrator } from "../../../domain/model/Administrator";
import { NotificationService } from "../../../domain/service/notification.service";
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { Router } from '@angular/router';
import { RestaurantsService } from 'src/domain/service/RestaurantsService';
import jsPDF from 'jspdf';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-create-account-container',
  templateUrl: './create-account-container.component.html',
  styleUrl: './create-account-container.component.scss'
})
export class CreateAccountContainerComponent implements OnDestroy {

  @ViewChild('contractContent') contractContent!: ElementRef;
  @ViewChild('signaturePad') signaturePadElement!: ElementRef;

  restaurantForm!: FormGroup;
  selectedAdminFile!: File | null;
  selectedRestaurantFile!: File | null;
  isLoading: boolean = false;
  restaurantImageUrl: string | null = null;
  adminImageUrl: string | null = null;
  transactionId= ''
  // Ajouter cette propriété pour stocker le contenu du contrat
  private contractHTML: string = '';

  filteredCities: Observable<string[]> | undefined;
  cities: { [postalCode: string]: string[] } = {};

  private signaturePad: SignaturePad | null = null;
  signatureImageUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantsService,
    private notificationService: NotificationService,
    private firebaseStorageService: FirebaseStorageService,
    private router: Router
  ) {
    this.buildForm();
    this.setupCityPostalCodeValidation();
  }

  buildForm() {
    this.restaurantForm = this.formBuilder.group({
      name: [undefined, [Validators.required]],
      street: [undefined, [Validators.required]],
      postalCode: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{5}$')
      ]],
      city: ['', [Validators.required]],
      siret: [undefined, [Validators.required]],
      tva: [undefined, [Validators.required]],
      firstName: [undefined, [Validators.required]],
      lastName: [undefined, [Validators.required]],
      email: [undefined, [Validators.required, Validators.email]],
      phoneNumber: [undefined, [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) // Au moins 8 caractères, une lettre et un chiffre
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Supprimer tous les écouteurs de changement qui affichent les erreurs
    // On garde uniquement les écouteurs pour le code postal et la ville
    this.restaurantForm.get('postalCode')?.valueChanges.subscribe(value => {
      if (value && value.length === 5 && /^\d{5}$/.test(value)) {
        this.fetchCityForPostalCode(value);
      }
    });

    this.restaurantForm.get('city')?.valueChanges.subscribe(value => {
      if (value && value.length >= 3) {
        this.fetchPostalCodeForCity(value);
      }
    });
  }

  private setupCityPostalCodeValidation() {
    // Observer les changements du code postal
    this.restaurantForm.get('postalCode')?.valueChanges.subscribe(postalCode => {
      if (postalCode?.length === 5 && /^\d{5}$/.test(postalCode)) {
        this.fetchCitiesForPostalCode(postalCode);
      }
    });

    // Observer les changements de la ville avec autocomplétion
    this.filteredCities = this.restaurantForm.get('city')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCities(value || ''))
    );
  }

  private async fetchCitiesForPostalCode(postalCode: string) {
    try {
      const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom`);
      const cities = await response.json();
      
      if (cities.length > 0) {
        this.cities[postalCode] = cities.map((city: any) => city.nom);
        
        // Si une seule ville, on la sélectionne automatiquement
        if (cities.length === 1) {
          this.restaurantForm.patchValue({
            city: cities[0].nom
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  private _filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    const postalCode = this.restaurantForm.get('postalCode')?.value;
    
    if (postalCode && this.cities[postalCode]) {
      return this.cities[postalCode].filter(city =>
        city.toLowerCase().includes(filterValue)
      );
    }
    return [];
  }

  private async waitForImages(): Promise<void> {
    const images = this.contractContent.nativeElement.getElementsByTagName('img');
    const imagePromises = Array.from(images).map((value: unknown) => {
      const img = value as HTMLImageElement;
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        }
      });
    });
    await Promise.all(imagePromises);
  }

  private initializeContractContent() {
    console.log("INIT 1: Début initialisation du contenu");
    if (this.currentStep === 'contract') {
      console.log("INIT 2: Étape contrat OK");
      const visibleContract = document.querySelector('.contract-content');
      console.log("INIT 3: Contrat visible trouvé:", visibleContract);
      if (visibleContract) {
        // Sauvegarder le contenu du contrat
        this.contractHTML = visibleContract.innerHTML;
        console.log("INIT 4: Contenu sauvegardé");
      }
    }
  }

  public async generateContractPdf(): Promise<Blob> {
    console.log("1. Début de la génération du PDF");
    
    const doc = new jsPDF();
    const values = this.restaurantForm.value;

    // Définir la police et la taille
    doc.setFont("helvetica");
    
    // Titre
    doc.setFontSize(20);
    doc.text('Contrat de Partenariat SmartMeal', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(12);
    doc.text(`Fait le ${this.getFormattedDate()}`, 200, 30, { align: 'right' });
    
    // Parties
    doc.setFontSize(12);
    let y = 50;
    
    doc.text('ENTRE LES SOUSSIGNÉS :', 20, y);
    y += 10;
    
    const smartmealText = 
      'La société SmartMeal, société par actions simplifiée au capital de X euros, ' +
      'dont le siège social est situé au 30-32 Avenue de la République, 94800 Villejuif, ' +
      'immatriculée au RCS de Paris sous le numéro XXX XXX XXX, ' +
      'représentée par M. Chihab Abdeldjalel et M. Kamguin Hermann en leurs qualités de Présidents,';
    
    const splitSmartmeal = doc.splitTextToSize(smartmealText, 170);
    doc.text(splitSmartmeal, 20, y);
    y += splitSmartmeal.length * 7;
    
    doc.text("Ci-après dénommée \"SmartMeal\",", 20, y);
    y += 7;
    doc.text("D'une part,", 20, y);
    y += 10;
    
    doc.text('ET :', 20, y);
    y += 10;
    
    const restaurantText = 
      `${values.name}, représenté(e) par ${values.firstName} ${values.lastName}, ` +
      `situé(e) au ${values.street}, ${values.postalCode} ${values.city}, ` +
      `SIRET : ${values.siret}, TVA : ${values.tva}`;
    
    const splitRestaurant = doc.splitTextToSize(restaurantText, 170);
    doc.text(splitRestaurant, 20, y);
    y += splitRestaurant.length * 7;
    
    doc.text("Ci-après dénommé \"le Restaurant Partenaire\",", 20, y);
    y += 7;
    doc.text("D'autre part,", 20, y);
    y += 15;
    
    // Articles
    const articles = [
      {
        title: 'Article 1 - Objet du Contrat',
        content: 'Le présent contrat a pour objet de définir les conditions dans lesquelles le Restaurant Partenaire utilisera la plateforme SmartMeal pour la gestion numérique de son établissement.'
      },
      {
        title: 'Article 2 - Services Fournis',
        content: 'SmartMeal s\'engage à fournir au Restaurant Partenaire :\n' +
                '• Une interface de gestion de menu digitale\n' +
                '• Un système de commande en ligne\n' +
                '• Un tableau de bord analytique\n' +
                '• Un support technique 7j/7'
      },
      {
        title: 'Article 3 - Durée',
        content: 'Le présent contrat est conclu pour une durée initiale de 12 mois à compter de sa signature.'
      },
      {
        title: 'Article 4 - Conditions Financières',
        content: 'Le Restaurant Partenaire s\'engage à verser :\n' +
                '• Frais d\'inscription : 30,00 € HT\n' +
                '• Commission mensuelle : 2% du chiffre d\'affaires généré via la plateforme'
      },
      {
        title: 'Article 5 - Obligations des Parties',
        content: 'Le Restaurant Partenaire s\'engage à :\n' +
                '• Maintenir à jour ses informations sur la plateforme\n' +
                '• Respecter les normes d\'hygiène et de sécurité alimentaire\n' +
                '• Traiter les commandes dans les délais convenus'
      }
    ];
    
    articles.forEach(article => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(14);
      doc.text(article.title, 20, y);
      y += 7;
      
      doc.setFontSize(12);
      const splitContent = doc.splitTextToSize(article.content, 170);
      doc.text(splitContent, 20, y);
      y += splitContent.length * 7 + 10;
    });
    
    // Signatures
    if (y > 220) {
      doc.addPage();
      y = 20;
    }
    
    y += 10;
    // Colonne de gauche - SmartMeal
    doc.text('Pour SmartMeal :', 20, y);
    y += 30;
    
    // Ajouter les images des signatures
    try {
      const img1 = new Image();
      img1.src = '/assets/img/signature.png';
      doc.addImage(img1, 'PNG', 20, y, 50, 20);
      
      const img2 = new Image();
      img2.src = '/assets/img/signature-2.png';
      doc.addImage(img2, 'PNG', 20, y + 25, 50, 20);
    } catch (error) {
      console.error("Erreur lors de l'ajout des signatures:", error);
    }
    
    y += 50;
    doc.text('Chihab Abdeldjalel, Kamguin Hermann', 20, y);
    y += 7;
    doc.text('Présidents', 20, y);

    // Colonne de droite - Restaurant Partenaire
    y -= 57; // Revenir à la hauteur du début des signatures
    doc.text('Pour le Restaurant Partenaire :', 120, y);
    y += 20;
    
    // Ajouter la déclaration "Je soussigné"
    const declarationText = `Je soussigné(e) ${values.firstName} ${values.lastName},\naccepte les termes de ce contrat`;
    const splitDeclaration = doc.splitTextToSize(declarationText, 80);
    doc.text(splitDeclaration, 120, y);
    
    y += splitDeclaration.length * 7 + 10;
    doc.text(`Date : ${this.currentDate}`, 120, y);
    
    // Ajouter la signature du partenaire
    if (this.signatureImageUrl) {
      try {
        const img = new Image();
        img.src = this.signatureImageUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        doc.addImage(img, 'PNG', 120, y + 30, 50, 20);
      } catch (error) {
        console.error("Erreur lors de l'ajout de la signature du partenaire:", error);
      }
    }
    
    // Convertir en Blob
    const pdfBlob = doc.output('blob');
    console.log("2. PDF généré avec succès");
    
    return pdfBlob;
  }

  onPaymentSuccess = async (paymentId: string) => {
    try {
      this.transactionId = paymentId
      console.log("A. Début du processus de paiement avec paymentId:", paymentId);
      if (!this.contractContent) {
        console.error("B. contractContent n'est pas disponible");
        this.notificationService.send(NotificationService.getAnError("Le contrat n'est pas prêt", []));
        return;
      }
      
      console.log("C. Génération du PDF...");
      const contractPdfBlob = await this.generateContractPdf();
      console.log("D. PDF généré, taille:", contractPdfBlob.size, "bytes");
      
      console.log("E. Upload du PDF vers Firebase...");
      const contractUrl = await this.firebaseStorageService.uploadPdfContract(
        contractPdfBlob,
        this.restaurantForm.value.siret
      );
      console.log("F. PDF uploadé avec succès, URL:", contractUrl);

      const values = this.restaurantForm.value;
      
      let restaurantIllustrationUrl: string = '';
      if (this.selectedRestaurantFile) {
        const restaurantFilePath = `restaurant-images/${this.selectedRestaurantFile.name}`;
        restaurantIllustrationUrl = await this.firebaseStorageService.uploadFile(this.selectedRestaurantFile, restaurantFilePath);
      }
  
      let adminIllustrationUrl: string = '';
      if (this.selectedAdminFile) {
        const adminFilePath = `admin-images/${this.selectedAdminFile.name}`;
        adminIllustrationUrl = await this.firebaseStorageService.uploadFile(this.selectedAdminFile, adminFilePath);
      }
  
      const administrator: Administrator = {
        firstName: values["firstName"],
        lastName: values["lastName"],
        email: values["email"],
        phoneNumber: values["phoneNumber"],
        password: values["password"],
        illustration: adminIllustrationUrl,
      };
  
      const restaurant: Restaurant = {
        name: values['name'],
        illustration: restaurantIllustrationUrl,
        address: `${values['street']}, ${values['postalCode']} ${values['city']}`,
        siret: values['siret'],
        tva: values['tva'],
        admin: administrator,
        contractUrl: contractUrl,
        paymentId: paymentId
      };
      
      console.log('Restaurant à créer:', restaurant);
      console.log('PaymentId dans l\'objet restaurant:', restaurant.paymentId);

      await this.create(restaurant);
      
    } catch (error) {
      console.error("Z. Erreur dans onPaymentSuccess:", error);
      this.notificationService.send(NotificationService.getAnError("Une erreur est survenue", []));
    }
  }

  async submit() {
    // Marquer tous les champs comme touchés pour déclencher les validations
    Object.keys(this.restaurantForm.controls).forEach(key => {
      const control = this.restaurantForm.get(key);
      control?.markAsTouched();
    });

    if (!this.restaurantForm.valid) {
      let errorMessage = 'Veuillez corriger les erreurs suivantes:\n';
      
      // Vérification des champs vides
      Object.keys(this.restaurantForm.controls).forEach(key => {
        const control = this.restaurantForm.get(key);
        if (control?.errors?.['required']) {
          errorMessage += `- Le champ ${this.getFieldLabel(key)} est requis\n`;
        }
      });

      // Vérification spécifique du code postal
      if (this.restaurantForm.get('postalCode')?.errors?.['pattern']) {
        errorMessage += '- Le code postal doit contenir 5 chiffres\n';
      }

      // Vérification du format email
      if (this.restaurantForm.get('email')?.errors?.['email']) {
        errorMessage += '- Format d\'email invalide\n';
      }

      // Vérification des mots de passe
      const password = this.restaurantForm.get('password');
      const confirmPassword = this.restaurantForm.get('confirmPassword');

      if (password?.value !== confirmPassword?.value) {
        errorMessage += '- Les mots de passe ne correspondent pas\n';
      }

      if (password?.errors?.['minlength']) {
        errorMessage += '- Le mot de passe doit contenir au moins 8 caractères\n';
      }

      if (password?.errors?.['pattern']) {
        errorMessage += '- Le mot de passe doit contenir au moins une lettre et un chiffre\n';
      }

      this.notificationService.send(NotificationService.getAnError(errorMessage, []));
      return;
    }

    this.isLoading = true;

    try {
      const values = this.restaurantForm.value;
  
      let restaurantIllustrationUrl: string = '';
      if (this.selectedRestaurantFile) {
        const restaurantFilePath = `restaurant-images/${this.selectedRestaurantFile.name}`;
        restaurantIllustrationUrl = await this.firebaseStorageService.uploadFile(this.selectedRestaurantFile, restaurantFilePath);
      }
  
      let adminIllustrationUrl: string = '';
      if (this.selectedAdminFile) {
        const adminFilePath = `admin-images/${this.selectedAdminFile.name}`;
        adminIllustrationUrl = await this.firebaseStorageService.uploadFile(this.selectedAdminFile, adminFilePath);
      }
  
      const administrator: Administrator = {
        firstName: values["firstName"],
        lastName: values["lastName"],
        email: values["email"],
        phoneNumber: values["phoneNumber"],
        password: values["password"],
        illustration: adminIllustrationUrl,
      };
  
      const restaurant: Restaurant = {
        name: values['name'],
        illustration: restaurantIllustrationUrl,
        address: `${values['street']}, ${values['postalCode']} ${values['city']}`,
        siret: values['siret'],
        tva: values['tva'],
        admin: administrator,
      };

      await this.create(restaurant);
    } catch (error) {
      console.error("Une erreur est survenue lors du traitement des fichiers ou des données:", error);
      this.notificationService.send(NotificationService.getAnError("Erreur lors du téléchargement ou de la création", []));
    } finally {
      this.isLoading = false;
    }
  }

  private async create(restaurant: Restaurant) {
    try {
      await this.restaurantService.createOrUpdateRestaurant(restaurant);
      this.notificationService.send(NotificationService.getAnInfo("Compte créé avec succès !", []));
      this.router.navigate(['/account/login']);
    } catch (e: any) {
      if (e.error.includes("L'email est déjà utilisé")) {
        this.notificationService.send(NotificationService.getAnError("Cet email est déjà utilisé. Veuillez en utiliser un autre.", []));
      } else {
        this.notificationService.send(NotificationService.getAnError("Impossible de créer le compte", []));
      }
    }
  }

  onAdminPictureSelected(file: File | null): void {
    this.selectedAdminFile = file;
    if (file) {
      this.adminImageUrl = URL.createObjectURL(file);
    } else {
      this.adminImageUrl = null;
    }
    console.log('Fichier admin sélectionné:', this.selectedAdminFile);
  }

  onRestaurantPictureSelected(file: File | null): void {
    this.selectedRestaurantFile = file;
    if (file) {
      this.restaurantImageUrl = URL.createObjectURL(file);
    } else {
      this.restaurantImageUrl = null;
    }
    console.log('Fichier restaurant sélectionné:', this.selectedRestaurantFile);
  }

  currentStep: string = 'restaurant';
  steps: string[] = ['restaurant', 'admin', 'summary', 'contract', 'payment'];
  contractAccepted: boolean = false;
  currentDate: string = new Date().toLocaleDateString('fr-FR');

  goTo(step: string) {
    if (this.canNavigateToStep(step)) {
      this.currentStep = step;
      if (step === 'contract') {
        setTimeout(() => {
          this.initializeSignaturePad();
        });
      }
    } else {
      this.notificationService.send(NotificationService.getAnError('Veuillez remplir toutes les étapes précédentes.'));
    }
  }

  nextStep() {
    if (this.currentStep === 'contract' && !this.contractAccepted) {
      this.notificationService.send(
        NotificationService.getAnError("Veuillez signer le contrat pour continuer", [])
      );
      return;
    }
    const currentIndex = this.steps.indexOf(this.currentStep);
    if (currentIndex < this.steps.length - 1) {
      let hasErrors = false;
      let errorMessage = 'Veuillez corriger les erreurs suivantes:\n\n';

      if (this.currentStep === 'restaurant') {
        // Vérifier les champs de l'étape restaurant
        ['name', 'street', 'postalCode', 'city', 'siret', 'tva'].forEach(field => {
          const control = this.restaurantForm.get(field);
          control?.markAsTouched();
          
          if (control?.errors) {
            hasErrors = true;
            if (control.errors['required']) {
              errorMessage += `- Le champ ${this.getFieldLabel(field)} est requis\n\n`;
            }
            if (field === 'postalCode' && control.errors['pattern']) {
              errorMessage += '- Le code postal doit contenir 5 chiffres\n\n';
            }
          }
        });

      } else if (this.currentStep === 'admin') {
        // Vérifier les champs de l'étape admin
        ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword'].forEach(field => {
          const control = this.restaurantForm.get(field);
          control?.markAsTouched();
          
          if (control?.errors) {
            hasErrors = true;
            if (control.errors['required']) {
              errorMessage += `- Le champ ${this.getFieldLabel(field)} est requis\n\n`;
            }
            if (field === 'email' && control.errors['email']) {
              errorMessage += '- Format d\'email invalide\n\n';
            }
            if (field === 'password') {
              if (control.errors['minlength']) {
                errorMessage += '- Le mot de passe doit contenir au moins 8 caractères\n\n';
              }
              if (control.errors['pattern']) {
                errorMessage += '- Le mot de passe doit contenir au moins une lettre et un chiffre\n\n';
              }
            }
            if (field === 'confirmPassword' && control.errors['passwordMismatch']) {
              errorMessage += '- Les mots de passe ne correspondent pas\n\n';
            }
          }
        });
      }

      if (hasErrors) {
        errorMessage = errorMessage.trim();
        this.notificationService.send(NotificationService.getAnError(errorMessage, []));
        return;
      }

      if (this.currentStep === 'contract' && !this.contractAccepted) {
        this.notificationService.send(
          NotificationService.getAnError("Veuillez accepter le contrat pour continuer", [])
        );
        return;
      }

      // Si pas d'erreurs, passer à l'étape suivante
      this.currentStep = this.steps[currentIndex + 1];
      if (this.steps[currentIndex + 1] === 'contract') {
        setTimeout(() => {
          this.initializeSignaturePad();
        });
      }
    }
  }

  previousStep() {
    const currentIndex = this.steps.indexOf(this.currentStep);
    if (currentIndex > 0) {
      this.currentStep = this.steps[currentIndex - 1];
      if (this.steps[currentIndex - 1] === 'contract') {
        setTimeout(() => {
          this.initializeSignaturePad();
        });
      }
    }
  }

  canNavigateToStep(step: string): boolean {
    const targetIndex = this.steps.indexOf(step);
    const currentIndex = this.steps.indexOf(this.currentStep);
    
    if (targetIndex <= currentIndex) return true;

    // Vérifier si l'étape actuelle est valide avant de permettre la navigation
    if (this.currentStep === 'restaurant' && step === 'admin') {
      return this.validateRestaurantStep();
    } else if (this.currentStep === 'admin' && step === 'summary') {
      return this.validateRestaurantStep() && this.validateAdminStep();
    } else if (step === 'payment') {
      return this.validateRestaurantStep() && 
             this.validateAdminStep() && 
             this.contractAccepted;
    }
    
    return false;
  }

  private validateRestaurantStep(): boolean {
    const restaurantControls = ['name', 'street', 'postalCode', 'city', 'siret', 'tva'];
    return restaurantControls.every(control => 
      this.restaurantForm.get(control)?.valid
    );
  }

  private validateAdminStep(): boolean {
    const adminControls = ['firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword'];
    return adminControls.every(control => 
      this.restaurantForm.get(control)?.valid
    );
  }

  getFormattedAddress(): string {
    const values = this.restaurantForm.value;
    return `${values.street}, ${values.postalCode} ${values.city}`;
  }

  getFormattedDate(): string {
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  acceptContract() {
    this.contractAccepted = true;
  }

  ngOnDestroy() {
    if (this.restaurantImageUrl) {
      URL.revokeObjectURL(this.restaurantImageUrl);
    }
    if (this.adminImageUrl) {
      URL.revokeObjectURL(this.adminImageUrl);
    }
    if (this.signatureImageUrl) {
      URL.revokeObjectURL(this.signatureImageUrl);
    }
  }

  private async fetchCityForPostalCode(postalCode: string) {
    try {
      const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom`);
      const cities = await response.json();
      
      if (cities.length === 1) {
        this.restaurantForm.patchValue({
          city: cities[0].nom
        }, { emitEvent: false }); // Évite une boucle infinie
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  private async fetchPostalCodeForCity(cityName: string) {
    try {
      const response = await fetch(`https://geo.api.gouv.fr/communes?nom=${cityName}&fields=nom,codesPostaux`);
      const cities = await response.json();
      
      if (cities.length === 1 && cities[0].codesPostaux.length === 1) {
        this.restaurantForm.patchValue({
          postalCode: cities[0].codesPostaux[0]
        }, { emitEvent: false }); // Évite une boucle infinie
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du code postal:', error);
    }
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword.errors) {
      // Si il y a d'autres erreurs, on les garde, sinon on met à null
      const { passwordMismatch, ...otherErrors } = confirmPassword.errors;
      confirmPassword.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }

    return null;
  }

  // Méthodes pour obtenir les messages d'erreur
  getPasswordErrorMessage(): string {
    const control = this.restaurantForm.get('password');
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Le mot de passe est requis';
      }
      if (control.errors['minlength']) {
        return 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (control.errors['pattern']) {
        return 'Le mot de passe doit contenir au moins une lettre et un chiffre';
      }
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.restaurantForm.get('confirmPassword');
    if (control?.errors) {
      if (control.errors['required']) {
        return 'La confirmation du mot de passe est requise';
      }
      if (control.errors['passwordMismatch']) {
        return 'Les mots de passe ne correspondent pas';
      }
    }
    return '';
  }

  // Fonction helper pour obtenir le libellé des champs
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nom du restaurant',
      street: 'Rue',
      postalCode: 'Code postal',
      city: 'Ville',
      siret: 'SIRET',
      tva: 'TVA',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      phoneNumber: 'Téléphone',
      password: 'Mot de passe',
      confirmPassword: 'Confirmation du mot de passe'
    };
    return labels[fieldName] || fieldName;
  }

  private showFieldError(fieldName: string, control: AbstractControl) {
    if (control.errors?.['required']) {
      this.notificationService.send(
        NotificationService.getAnError(`Le champ ${this.getFieldLabel(fieldName)} est requis`, [])
      );
    } else if (control.errors?.['minlength'] && fieldName === 'password') {
      this.notificationService.send(
        NotificationService.getAnError("Le mot de passe doit contenir au moins 8 caractères", [])
      );
    } else if (control.errors?.['pattern']) {
      if (fieldName === 'password') {
        this.notificationService.send(
          NotificationService.getAnError("Le mot de passe doit contenir au moins une lettre et un chiffre", [])
        );
      } else if (fieldName === 'postalCode') {
        this.notificationService.send(
          NotificationService.getAnError("Le code postal doit contenir 5 chiffres", [])
        );
      }
    }
  }

  ngAfterViewInit() {
    if (this.currentStep === 'contract') {
      this.initializeSignaturePad();
    }
  }

  private initializeSignaturePad() {
    if (this.signaturePadElement && this.signaturePadElement.nativeElement) {
      if (this.signaturePad) {
        this.signaturePad.clear();
      }
      this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
        velocityFilterWeight: 0.7,
        minWidth: 0.5,
        maxWidth: 2.5,
        throttle: 16, // max 60fps
      });
    } else {
      console.error('Element signature pad non trouvé');
    }
  }

  clearSignature() {
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.signatureImageUrl = null;
    }
  }

  async saveSignature() {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      this.notificationService.send(
        NotificationService.getAnError("Veuillez signer le contrat avant de continuer", [])
      );
      return;
    }

    // Convertir la signature en image
    this.signatureImageUrl = this.signaturePad.toDataURL();
    this.contractAccepted = true;
  }
}
