import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {ItemFlowService} from "../flow/item-flow.service";
import {CreateOrUpdateItemFlow} from "../flow/CreateOrUpdateItemFlow";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {StepManager} from "../flow/StepManager";
import {StepManagerService} from "../flow/step-manager.service";
import {NotificationService} from "../../domain/service/notification.service";
import {ManageFormsService} from "./step/form-service/manage-forms.service";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-or-update-item-page',
  templateUrl: './create-or-update-item-page.component.html',
  styleUrl: './create-or-update-item-page.component.scss',
})
export class CreateOrUpdateItemPageComponent implements AfterViewInit, OnDestroy {

  @Input()
  toUpdate = false
  public displaySectionModal: boolean = false
  public displayItemModal: boolean = false

  //new
  public stepManager: StepManager = new StepManager('ITEM')
  public currentStep!: Promise<number>;
  public totalStep!: number;
  public percentStep!: Promise<number>;
  public displayPrevious!: Promise<boolean>;
  public currentTypeOfItem!: string;
  public shouldSave: boolean = false;
  public isAdminDashboard: boolean = false;

  constructor(public legacyService: ItemFlowService,
              private createOrUpdateItemFlow: CreateOrUpdateItemFlow,
              private router: Router,
              private stepManagerService: StepManagerService,
              private errorService: NotificationService,
              private manageFormService: ManageFormsService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['id']) {
        this.createOrUpdateItemFlow.itemIdToUpdate.next(params['id']);
        this.toUpdate = true;
      } else {
        this.createOrUpdateItemFlow.itemIdToUpdate.next(undefined);
      }
    });

    // Vérification initiale de l'URL
    this.isAdminDashboard = this.router.url.includes('administration');

    // S'abonner aux changements de route
    this.router.events.subscribe(() => {
      this.isAdminDashboard = this.router.url.includes('administration');
    });

    this.retrieveLiveType()
    this.handleGoBack()

  }

  ngOnDestroy(): void {
    console.log("je me destruct");
    this.createOrUpdateItemFlow.reset();
    }

  ngAfterViewInit(): void {
  }

  formIsCompleted() {
    return this.createOrUpdateItemFlow.formDone
  }

  handleDataAboutFlow() {
    this.createOrUpdateItemFlow.numberOfStep.subscribe((total) => {
      this.totalStep = total
    this.stepManagerService.currentStep.subscribe(async step => {
      let stepNumber;
      if (step === 'SECTION')
        stepNumber = 1
      else if (step === 'SUMMARY')
        stepNumber = this.currentTypeOfItem === 'SIMPLE' ? 1 : 2
      else
        stepNumber = 0

      this.shouldSave = step === 'SUMMARY'
      this.currentStep = new Promise(resolve => {
        resolve(stepNumber)
      })

      this.percentStep = new Promise(resolve => {
          resolve(Math.floor(stepNumber * 100 / this.totalStep))
        })
      })
    })
  }

  public numberOfSteps() {
    return this.createOrUpdateItemFlow.numberOfStep
  }

  private retrieveLiveType() {
    this.createOrUpdateItemFlow.type.subscribe(type => {
      this.currentTypeOfItem = type
      this.handleDataAboutFlow()
    })
  }

  async next() {
    const nextStep = await this.stepManagerService.getNextStep(this.currentTypeOfItem);
    const currentStep = await this.currentStep;

    if(currentStep === 0 && this.manageFormService.hasErrorOnItemForm){
      return;
    }
    if(currentStep === 1 && this.manageFormService.hasErrorOnSectionStep){
      this.errorService.send({message: "Veuillez ajouter au minimum une section"});
      return;
    }

    if (this.isAdminDashboard) {
      this.router.navigate(['/administration/dashboard/manage-items', nextStep], {
        queryParams: {id: this.createOrUpdateItemFlow.itemId}
      });
    } else {
      this.router.navigate([nextStep], {
        relativeTo: this.activatedRoute,
        queryParams: {id: this.createOrUpdateItemFlow.itemId}
      });
    }
  }

  async previous() {
    const previousStep = await this.stepManagerService.getPreviousStep(this.currentTypeOfItem);

    if (this.isAdminDashboard) {
      this.router.navigate(['/administration/dashboard/manage-items', previousStep], {
        queryParams: {id: this.createOrUpdateItemFlow.itemId}
      });
    } else {
      this.router.navigate([previousStep], {
        relativeTo: this.activatedRoute,
        queryParams: {id: this.createOrUpdateItemFlow.itemId}
      });
    }
  }

  async process() {
    if (this.shouldSave) {
      try {
        const restaurantId = this.authService.getUserData().restaurantId;
        await this.createOrUpdateItemFlow.save(restaurantId);
      } catch (error) {
        console.log(error);
        return;
      }

      if (this.isAdminDashboard) {
        this.router.navigate(['/administration/dashboard/manage-items/done'], {
          queryParams: {id: this.createOrUpdateItemFlow.itemId}
        });
      } else {
        this.router.navigate(['done'], { relativeTo: this.activatedRoute });
      }
    } else {
      const currentStep = await this.currentStep;
      if (currentStep === 0) {
        this.createOrUpdateItemFlow.setCommonDataAction();
      }
      this.next();
      this.stepManagerService.completeStep(this.stepManagerService.getStepByIndex(currentStep, this.currentTypeOfItem), this.currentTypeOfItem);
    }
  }

  public handleGoBack() {
    this.stepManagerService.getCurrentStep().subscribe((step) => {
      this.displayPrevious = new Promise(resolve => {
        resolve(step === 'SECTION' || step === 'SUMMARY');
      })
    })
  }

  public validateButton() {
    if (this.shouldSave) {
      return 'Valider'
    }
    return 'Suivant'
  }
}
