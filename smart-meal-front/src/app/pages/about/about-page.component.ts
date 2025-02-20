import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent {
  features = [
    {
      title: 'Côté Client',
      description: 'Une expérience fluide et intuitive avec commande directe depuis la table',
      icon: 'person'
    },
    {
      title: 'Côté Restaurateur',
      description: 'Inscription instantanée et gestion simplifiée de votre établissement',
      icon: 'restaurant'
    },
    {
      title: 'Économique',
      description: 'Économisez jusqu\'à 13 500 € an pour un restaurant de taille moyenne',
      icon: 'savings'
    }
  ];

  clientFeatures = [
    {
      title: 'Installation facile',
      description: 'Téléchargement simple via l\'app store habituel',
      icon: 'download'
    },
    {
      title: 'Accès rapide',
      description: 'Scan du QR code unique à chaque table',
      icon: 'qr_code'
    },
    {
      title: 'Commande simplifiée',
      description: 'Commande sur place ou à emporter en quelques clics',
      icon: 'restaurant_menu'
    },
    {
      title: 'Notifications',
      description: 'Suivi en temps réel de votre commande',
      icon: 'notifications'
    }
  ];

  restaurateurFeatures = [
    {
      title: 'Inscription rapide',
      description: 'Quelques clics suffisent pour être opérationnel',
      icon: 'app_registration'
    },
    {
      title: 'Gestion du menu',
      description: 'Créez et modifiez votre menu facilement',
      icon: 'menu_book'
    },
    {
      title: 'Statistiques',
      description: 'Suivez vos performances en temps réel',
      icon: 'analytics'
    },
    {
      title: 'QR Codes',
      description: 'Générez des QR codes pour toutes vos tables',
      icon: 'qr_code_2'
    }
  ];

  savings = [
    {
      title: 'Économie d\'énergie',
      value: '-75%',
      description: 'd\'électricité consommée',
      icon: 'bolt'
    },
    {
      title: 'Augmentation CA',
      value: '+20%',
      description: 'de chiffre d\'affaires',
      icon: 'trending_up'
    },
    {
      title: 'Économies annuelles',
      value: '13 500€',
      description: 'pour un restaurant moyen',
      icon: 'euro'
    }
  ];
} 