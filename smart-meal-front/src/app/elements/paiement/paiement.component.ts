import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import {
  Stripe,
  StripeElements,
  loadStripe,
  PaymentMethod,
  StripePaymentRequestButtonElement,
} from '@stripe/stripe-js';
import { loadScript } from '@paypal/paypal-js';
import lottie from 'lottie-web';
import { RestApiProvider } from 'src/infra/rest/RestApiProvider';
import { Router } from '@angular/router';
import { CreateOrderInput } from 'src/domain/model/input/CreateOrderInput';
import { OrdersService } from 'src/domain/service/OrderService';

declare global {
  interface Window {
    ApplePaySession?: any;
  }
  const ApplePaySession: any;
}

@Component({
  selector: 'paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.scss']
})
export class PaiementComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() transactionId!: string;
  @Input() orderData!: CreateOrderInput;
  @Input() transactionTotal!: number;
  @Input() onPaymentSuccess!: (paymentId: string) => void;
  @Input() onCancelPayment!: () => void;
  @Input() onTerminalPayment: () => void = () => {};

  @ViewChild('paypalButtonContainer') paypalButtonContainer!: ElementRef;
  @ViewChild('successAnimation') successAnimation!: ElementRef;


  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: any = null;
  private paymentRequestButton: StripePaymentRequestButtonElement | null = null;
  private paypalInstance: any = null;

  selectedMethod: string = 'card';
  errorMessage: string = '';
  isGooglePayAvailable: boolean = false;
  isApplePayAvailable: boolean = false;
  paymentSuccess: boolean = false;
  isProcessing: boolean = false;

  public isAccountCreate: boolean = false;

  constructor(
    private provider: RestApiProvider,
    private router: Router,
    private ordersService: OrdersService
  ) {
    this.isAccountCreate = this.router.url.includes('account/create');
  }

  async ngOnInit() {
    await this.initStripe();
    if (this.selectedMethod === 'googlepay') {
      await this.initGooglePay();
    } else if (this.selectedMethod === 'applepay') {
      await this.initApplePay();
    }
  }

  ngAfterViewInit() {
    if (this.selectedMethod === 'paypal') {
      this.initPayPal();
    }
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.unmount();
      this.card = null;
    }
    if (this.paymentRequestButton) {
      this.paymentRequestButton.unmount();
      this.paymentRequestButton = null;
    }
    if (this.paypalInstance) {
      this.paypalButtonContainer.nativeElement.innerHTML = '';
    }
  }

  private async initStripe() {
    try {
      this.stripe = await loadStripe('pk_test_51Qi2jrJDDdPAbT69itFLGcDksZv6oTryH1Gj92lOKwJRt8mmySlefZCZ1gTIhxwRDYGJC52hXb5pC69MLBoVnuN400QtcqRRZb');

      if (this.stripe) {
        this.elements = this.stripe.elements();

        // Créer l'élément de carte seulement si c'est la méthode sélectionnée initialement
        if (this.selectedMethod === 'card') {
          this.card = this.elements.create('card');
          const cardElement = document.getElementById('card-element');
          if (cardElement) {
            this.card.mount('#card-element');
            this.card.on('change', (event: { error?: { message: string } }) => {
              this.errorMessage = event.error?.message || '';
            });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Stripe:', error);
    }
  }

  private async initGooglePay() {
    if (!this.stripe || !this.elements) return;

    try {
      const paymentRequest = this.stripe.paymentRequest({
        country: 'FR',
        currency: 'eur',
        total: {
          label: 'Total',
          amount: this.transactionTotal * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: false,
      });

      // Vérifier si Google Pay est disponible
      const result = await paymentRequest.canMakePayment();
      this.isGooglePayAvailable = !!result?.['googlePay'];

      if (this.isGooglePayAvailable) {
        this.paymentRequestButton = this.elements.create('paymentRequestButton', {
          paymentRequest,
          style: {
            paymentRequestButton: {
              type: 'buy',
              theme: 'dark'
            }
          }
        });

        // Gérer l'événement de paiement
        paymentRequest.on('paymentmethod', async (event) => {
          try {
            const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
              '{CLIENT_SECRET}',
              {
                payment_method: event.paymentMethod.id
              },
              {
                handleActions: false
              }
            );

            if (error) {
              event.complete('fail');
              this.errorMessage = error.message || 'Une erreur est survenue';
            } else {
              event.complete('success');
              if (paymentIntent.status === 'requires_action') {
                const { error: confirmError } = await this.stripe!.confirmCardPayment('{CLIENT_SECRET}');
                if (confirmError) {
                  this.errorMessage = confirmError.message || 'Échec de l\'authentification 3D Secure';
                }
              }
              console.log('Paiement réussi:', paymentIntent);
            }
          } catch (err) {
            event.complete('fail');
            console.error('Erreur pendant le paiement:', err);
            this.errorMessage = 'Une erreur est survenue lors du traitement du paiement';
          }
        });

        const mountElement = document.getElementById('payment-request-button');
        if (mountElement) {
          await this.paymentRequestButton.mount('#payment-request-button');
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Google Pay:', error);
      this.errorMessage = 'Erreur lors de l\'initialisation de Google Pay';
    }
  }

  private async initPayPal() {
    try {
      if (!this.paypalButtonContainer?.nativeElement) {
        console.error('Le conteneur PayPal n\'est pas disponible');
        return;
      }

      this.paypalButtonContainer.nativeElement.innerHTML = '';

      const paypal = await loadScript({
        clientId: 'AQqsQATo5vVgDDH5-hewLaX0r1ew3qpH9sTMOodF81akmfJIZk2drJy0g5gX6aaLejl_qZ1eT4WRRz5f',
        currency: 'EUR',
      });

      if (!paypal) {
        throw new Error('PayPal SDK non chargé.');
      }

      if (paypal.Buttons) {
        this.paypalInstance = paypal.Buttons({
          createOrder: (_: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '30.00',
                },
              }],
            });
          },
          onApprove: async (_: any, actions: any) => {
            try {
              const order = await actions.order.capture();
              console.log('Paiement PayPal réussi:', order);
            } catch (error) {
              console.error('Erreur lors du paiement PayPal:', error);
              this.errorMessage = 'Erreur lors du paiement PayPal';
            }
          },
          onError: (err: any) => {
            console.error('Erreur lors du rendu ou du paiement PayPal:', err);
            this.errorMessage = 'Erreur lors du paiement PayPal';
          },
        });

        await this.paypalInstance.render(this.paypalButtonContainer.nativeElement);
      } else {
        console.error('paypal.Buttons n\'est pas disponible');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de PayPal:', error);
      this.errorMessage = 'Erreur lors de l\'initialisation de PayPal';
    }
  }

  private async initApplePay() {
    console.log('Démarrage de l\'initialisation d\'Apple Pay...');
    
    if (!this.stripe || !this.elements) {
      console.error('Stripe ou Elements non initialisé');
      return;
    }

    try {
      // Vérifier d'abord si l'appareil prend en charge Apple Pay
      const applePaySupport = await this.checkApplePaySupport();
      if (!applePaySupport) {
        console.log('Apple Pay n\'est pas supporté sur cet appareil');
        this.isApplePayAvailable = false;
        return;
      }

      console.log('Configuration de la requête de paiement Apple Pay...');
      const paymentRequest = this.stripe.paymentRequest({
        country: 'FR',
        currency: 'eur',
        total: {
          label: 'Total à payer',
          amount: this.transactionTotal * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: false,
      });

      // Vérifier si le paiement peut être effectué
      console.log('Vérification de la disponibilité du paiement...');
      const result = await paymentRequest.canMakePayment();
      console.log('Résultat de canMakePayment:', result);
      
      this.isApplePayAvailable = !!result?.['applePay'];
      console.log('Apple Pay est disponible:', this.isApplePayAvailable);

      if (this.isApplePayAvailable) {
        console.log('Création du bouton Apple Pay...');
        this.paymentRequestButton = this.elements.create('paymentRequestButton', {
          paymentRequest,
          style: {
            paymentRequestButton: {
              type: 'buy',
              theme: 'dark'
            }
          }
        });

        // Écouter l'événement de paiement
        paymentRequest.on('paymentmethod', async (event) => {
          console.log('Événement paymentmethod déclenché', event);
          
          try {
            // Créer la commande si orderData est présent
            let transactionId = this.transactionId;
            if (this.orderData) {
              transactionId = String(await this.ordersService.createOrder(this.orderData));
              console.log('Commande créée:', transactionId);
            }

            // Créer le PaymentIntent sur le serveur
            const response = await this.provider.post<any>('Paiement/create', {
              paymentMethodId: event.paymentMethod.id,
              amount: this.transactionTotal * 100,
              currency: 'eur',
              transactionId: transactionId,
              paymentType: "CUSTOMER_ORDER"
            });

            console.log('Réponse du serveur:', response);

            if (response.error) {
              console.error('Erreur serveur:', response.error);
              event.complete('fail');
              this.errorMessage = 'Erreur lors du traitement du paiement';
              return;
            }

            // Confirmer le paiement
            const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
              response.clientSecret,
              {
                payment_method: event.paymentMethod.id
              }
            );

            if (error) {
              console.error('Erreur de confirmation:', error);
              event.complete('fail');
              this.errorMessage = error.message || 'Erreur lors du paiement';
            } else {
              console.log('Paiement réussi:', paymentIntent);
              event.complete('success');
              this.showSuccessPopup(paymentIntent.id);
            }
          } catch (err) {
            console.error('Erreur lors du traitement:', err);
            event.complete('fail');
            this.errorMessage = 'Une erreur est survenue lors du traitement du paiement';
          }
        });

        // Monter le bouton
        const mountElement = document.getElementById('apple-pay-button');
        if (mountElement) {
          console.log('Montage du bouton Apple Pay...');
          await this.paymentRequestButton.mount('#apple-pay-button');
          console.log('Bouton Apple Pay monté avec succès');
        } else {
          console.error('Élément de montage Apple Pay non trouvé dans le DOM');
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation d\'Apple Pay:', error);
      this.errorMessage = 'Erreur lors de l\'initialisation d\'Apple Pay';
      this.isApplePayAvailable = false;
    }
  }

  // Nouvelle méthode pour vérifier le support d'Apple Pay
  private async checkApplePaySupport(): Promise<boolean> {
    console.log('Vérification du support Apple Pay...');
    
    // Vérifier si nous sommes sur Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    console.log('Est sur Safari:', isSafari);
    
    // Vérifier si Apple Pay est disponible dans le navigateur
    const hasApplePay = window.ApplePaySession && ApplePaySession.canMakePayments();
    console.log('ApplePaySession disponible:', !!window.ApplePaySession);
    console.log('Peut effectuer des paiements:', hasApplePay);

    return hasApplePay;
  }

  async selectMethod(method: string) {
    this.selectedMethod = method;

    switch (method) {
      case 'card':
        setTimeout(() => {
          if (this.stripe && this.elements && !this.card) {
            this.card = this.elements.create('card');
            const cardElement = document.getElementById('card-element');
            if (cardElement) {
              this.card.mount('#card-element');
              this.card.on('change', (event: { error?: { message: string } }) => {
                this.errorMessage = event.error?.message || '';
              });
            }
          } else if (this.card) {
            // Si l'élément existe déjà, on le remonte simplement
            const cardElement = document.getElementById('card-element');
            if (cardElement) {
              this.card.mount('#card-element');
            }
          }
        }, 0);
        break;

      case 'paypal':
        setTimeout(() => {
          this.initPayPal();
        }, 0);
        break;

      case 'googlepay':
        if (this.paymentRequestButton) {
          this.paymentRequestButton.unmount();
          this.paymentRequestButton = null;
        }
        await this.initGooglePay();
        break;

      case 'applepay':
        if (this.paymentRequestButton) {
          this.paymentRequestButton.unmount();
          this.paymentRequestButton = null;
        }
        await this.initApplePay();
        break;
    }
  }


  async payWithCard() {
    if (!this.stripe || !this.card || this.isProcessing) {
      this.errorMessage = 'Le service de paiement n\'est pas disponible';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    try {
      // 1. Créer la PaymentMethod
      const result = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: 'Client',
        },
      });

      if (result.error) {
        this.errorMessage = result.error.message || 'Une erreur est survenue';
        return;
      }

      const paymentMethodId = result.paymentMethod?.id;
      console.log('PaymentMethod créé:', paymentMethodId);

      // 2. Créer la commande si orderData est présent
      let transactionId = this.transactionId;
      if (this.orderData) {
        transactionId = String(await this.ordersService.createOrder(this.orderData));
        console.log('Commande créée:', transactionId);
      }

      // 3. Créer le PaymentIntent sur le serveur
      const response = await this.provider.post<any>('Paiement/create', {
        paymentMethodId: paymentMethodId,
        amount: this.transactionTotal * 100,
        currency: 'eur',
        transactionId: transactionId,
        paymentType: "CUSTOMER_ORDER"
      });

      console.log('Réponse du serveur:', response);

      // 4. Gérer l'authentification 3D Secure si nécessaire
      if (response.requiresAction) {
        const { error, paymentIntent } = await this.stripe.handleCardAction(response.clientSecret);

        if (error) {
          this.errorMessage = 'La vérification 3D Secure a échoué';
          return;
        }

        // Confirmer le paiement après 3D Secure
        const confirmResponse = await this.provider.post<any>('Paiement/confirm', {
          paymentIntentId: paymentIntent!.id
        });

        console.log('Confirmation response:', confirmResponse);

        if (confirmResponse.success) {
          const finalPaymentId = paymentIntent!.id;
          console.log('Payment ID final (3DS):', finalPaymentId);
          this.showSuccessPopup(finalPaymentId);
        } else {
          this.errorMessage = 'Le paiement a échoué';
        }
      } else if (response.success) {
        // Utiliser le PaymentMethod ID si le PaymentIntent ID n'est pas disponible
        const finalPaymentId = response.paymentIntentId || paymentMethodId;
        console.log('Payment ID final (direct):', finalPaymentId);
        this.showSuccessPopup(finalPaymentId);
      }

    } catch (e) {
      console.error('Erreur de paiement:', e);
      this.errorMessage = 'Une erreur est survenue lors du traitement du paiement';
    } finally {
      this.isProcessing = false;
    }
  }

  private async handlePaymentSuccess(paymentMethod: PaymentMethod) {
    console.log('Payment Method ID:', paymentMethod.id);

    try {
      // Simuler une confirmation côté serveur
      console.log('Paiement traité avec succès');

      // Afficher la popup de succès et passer l'ID
      this.showSuccessPopup(paymentMethod.id);
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      this.errorMessage = 'Erreur lors de la finalisation du paiement';
    }
  }

  private showSuccessPopup(paymentId: string) {
    console.log('showSuccessPopup appelé avec paymentId:', paymentId);
    this.paymentSuccess = true;

    setTimeout(() => {
      if (this.successAnimation?.nativeElement) {
        lottie.loadAnimation({
          container: this.successAnimation.nativeElement,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          path: '/assets/success-animation.json',
        });
      }
    });

    setTimeout(() => {
      this.paymentSuccess = false;
      console.log('Appel de onPaymentSuccess avec paymentId:', paymentId);
      this.onPaymentSuccess(paymentId);
    }, 3000);
  }

  formatNumberWithSpaces(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

}
