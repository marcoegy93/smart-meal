import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { StepManagerService } from "../../../flow/step-manager.service";
import { CreateOrUpdateItemFlow } from "../../../flow/CreateOrUpdateItemFlow";
import { Observable } from 'rxjs';
import { IItem } from '../../../../domain/model/IItem';

@Component({
  selector: 'app-summary-step',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './summary-step.component.html',
  styleUrl: './summary-step.component.scss'
})
export class SummaryStepComponent {
  item$: Observable<IItem>;

  constructor(
    private stepManager: StepManagerService, 
    private createOrUpdateItemFlow: CreateOrUpdateItemFlow
  ) {
    this.stepManager.updateCurrentStep('SUMMARY');
    this.item$ = this.createOrUpdateItemFlow.getLiveItem();
  }
}
