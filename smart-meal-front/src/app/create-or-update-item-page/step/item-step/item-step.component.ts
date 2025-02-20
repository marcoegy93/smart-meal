import {Component, Input, Output} from '@angular/core';
import {ItemFlowService} from "../../../flow/item-flow.service";
import {Section} from "../../../../domain/model/Section";
import {IItem} from "../../../../domain/model/IItem";
import {CreateOrUpdateItemFlow} from "../../../flow/CreateOrUpdateItemFlow";
import {StepManager} from "../../../flow/StepManager";
import {StepManagerService} from "../../../flow/step-manager.service";

@Component({
  selector: 'app-item-step',
  templateUrl: './item-step.component.html',
  styleUrl: './item-step.component.scss'
})
export class ItemStepComponent {

  public showFormToAddOrCreateItem: boolean = false
  public type: string = "INIT"

  public items: IItem[]= []

  constructor(public service: ItemFlowService, private createOrUpdateItemFlow: CreateOrUpdateItemFlow, private stepManager: StepManagerService) {
    this.stepManager.updateCurrentStep('ITEM')

    this.service.attemptSectionToAddInItemObservable.subscribe(value => {
      if(value?.items) {
        this.items = value.items
      }
    })
  }
}
