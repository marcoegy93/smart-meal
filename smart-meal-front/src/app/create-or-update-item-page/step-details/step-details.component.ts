import { Component } from '@angular/core';
import { ItemFlowService } from "../../flow/item-flow.service";
import { CreateOrUpdateItemFlow } from "../../flow/CreateOrUpdateItemFlow";
import { StepManagerService } from "../../flow/step-manager.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from 'src/domain/service/notification.service';

@Component({
  selector: 'app-step-details',
  standalone: true,
  imports: [],
  templateUrl: './step-details.component.html',
  styleUrl: './step-details.component.scss'
})
export class StepDetailsComponent {
  public typeOfCreatingItem: string = "SIMPLE"
  public currentStep: string = "ITEM"
  public isAdminDashboard: boolean = false;

  constructor(
    private createOrUpdateItemFlow: CreateOrUpdateItemFlow,
    private stepManager: StepManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.stepManager.currentStep.subscribe(value => {
      this.currentStep = value;
    });

    this.createOrUpdateItemFlow.type.subscribe((type) => {
      this.typeOfCreatingItem = type;
    });

    // Détecter si on est dans la page d'administration
    this.isAdminDashboard = this.router.url.includes('administration');
  }

  goTo(step: string) {
    if (this.currentStep === step) {
      return;
    }
    if (!this.stepManager.canNavigateToStep(this.typeOfCreatingItem, step)) {
      this.notificationService.send(NotificationService.getAnError('Veuillez remplir toutes les étapes précédentes avant de continuer.'));
      return;
    }

    const itemId = this.createOrUpdateItemFlow.itemId;
    
    if (this.isAdminDashboard) {
      // Dans la modale d'administration
      this.router.navigate(['/administration/dashboard/manage-items', step], {
        queryParams: { id: itemId }
      });
    } else {
      // Navigation normale
      this.router.navigate(['/manage-items', step], {
        relativeTo: this.activatedRoute.parent,
        queryParams: { id: itemId }
      });
    }
  }
}
