import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'qr-code-generator',
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generato.component.scss']
})
export class QrCodeGeneratorComponent implements OnInit {
  smartMealUrl: string = 'https://smartmeal.fr/customer/restaurant?restaurantId=';
  numberOfTables: number = 0;
  tables: number[] = [];


  constructor(    private authService: AuthService
  ){}
  ngOnInit(): void {
    this.smartMealUrl = this.smartMealUrl + this.authService.getUserData().restaurantId;
  }

  generateTables() {
    this.tables = Array(this.numberOfTables).fill(0).map((_, i) => i + 1);
  }

  // Fonction pour télécharger le QR code
  downloadQR(elementId: string, filename: string) {
    const canvas = document.querySelector(`#${elementId} canvas`) as HTMLCanvasElement;
    if (canvas) {
      // Créer un canvas temporaire pour combiner QR code et icône
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      const icon = document.querySelector(`#${elementId} .table-icon`) as HTMLImageElement;
      
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      if (ctx) {
        // Dessiner le QR code
        ctx.drawImage(canvas, 0, 0);
        
        // Attendre que l'icône soit chargée
        if (icon) {
          // Dessiner l'icône en bas du QR code
          const iconWidth = 20; // Taille de l'icône
          const iconHeight = 20;
          const iconX = (canvas.width - iconWidth) / 2;
          const iconY = canvas.height - iconHeight - 10; // 10px du bas
          
          ctx.drawImage(icon, iconX, iconY, iconWidth, iconHeight);
        }
        
        // Créer le lien de téléchargement
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
      }
    }
  }
}