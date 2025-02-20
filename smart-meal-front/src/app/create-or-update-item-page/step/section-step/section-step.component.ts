import {Component, OnInit} from '@angular/core';
import {ItemFlowService} from "../../../flow/item-flow.service";
import {Section} from "../../../../domain/model/Section";
import {CreateOrUpdateItemFlow} from "../../../flow/CreateOrUpdateItemFlow";
import {IItem, ItemType} from "../../../../domain/model/IItem";
import {Item} from "../../../../domain/model/Item";
import {StepManagerService} from "../../../flow/step-manager.service";
import {ManageFormsService} from "../form-service/manage-forms.service";
import { NotificationService } from 'src/domain/service/notification.service';


@Component({
  selector: 'app-section-step',
  templateUrl: './section-step.component.html',
  styleUrl: './section-step.component.scss'
})
export class SectionStepComponent implements OnInit {

  public showFormToAddOrCreateSection: boolean = false
  public sections: Section[] = []
  public managedSection: Section = {};
  public itemToUpdate?: {item?: IItem, index?: number, reset?: boolean}
  public indexOfExistingSection: number | undefined;
  public activateItemForm: boolean = false;
  public showExistingSections: boolean = true;

  constructor(public legacyService: ItemFlowService,
              private createOrUpdateItemFlow: CreateOrUpdateItemFlow,
              private stepManager: StepManagerService,
              private manageFormService: ManageFormsService,
              private notificationService: NotificationService) {
    console.log(this.managedSection)
    this.stepManager.updateCurrentStep('SECTION')


    this.createOrUpdateItemFlow.getLiveItem().subscribe(item => {
      console.log(item)
      this.sections = item.sections ?? []
      console.log(this.sections)
      this.manageFormService.handleSectionStep(this.sections.length)
    })
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  public openContainer(section?: Section, index?: number) {
    if(section) {
      this.managedSection = JSON.parse(JSON.stringify(section));
      this.indexOfExistingSection = index;
      this.showExistingSections = false;
      this.activateItemForm = (this.managedSection.name != undefined && 
                             this.managedSection.name.trim().length > 0 && 
                             this.managedSection.type != undefined);
    } else {
      this.managedSection = {};
      this.showExistingSections = true;
      this.indexOfExistingSection = undefined;
      this.activateItemForm = false;
    }
    this.showFormToAddOrCreateSection = true;
  }

  public setCommonDataOnSection(section: Section): void {
    console.log(section)
    this.managedSection = section

    this.activateItemForm = (this.managedSection.name != undefined && this.managedSection.name.trim().length > 0 && this.managedSection.type != undefined)
  }

  public async addItemOnSection(item?: {item: IItem, index?: number}) {
    if (!item) {
      this.itemToUpdate = undefined;
      return;
    }
    
    if (this.managedSection && !this.managedSection.items) {
      this.managedSection.items = [];
    }

    if (this.managedSection.items?.some(existingItem => 
        !item.item.hasChange && 
        existingItem.itemId !== undefined && 
        existingItem.itemId === item.item.itemId)) {
      this.notificationService.send(NotificationService.getAnError("Cette section contient déjà cet item"));
      return;
    }

    if (this.managedSection) {
      console.log(this.managedSection);
      console.log(item);

      if (item) {
        if (item.index !== undefined && this.managedSection.items) {
          this.managedSection.items[item.index] = item.item;
        } else {
          this.managedSection.items?.push(item.item);
        }
        
        this.managedSection = { ...this.managedSection };
      }
    }
  }

  public addSectionOnMainItem(){
    this.createOrUpdateItemFlow.addSection(this.managedSection!, this.indexOfExistingSection)
    this.activateItemForm = false
    this.reset();
    this.closeContainer()
  }

  private reset() {
    this.managedSection = {}
    this.indexOfExistingSection = undefined
  }

  closeContainer() {
    this.reset()
    this.showFormToAddOrCreateSection = false
  }

  updateItem(item: {item?: IItem, index?: number, reset?: boolean}) {
    console.log(item)
    this.itemToUpdate = item
  }

  removeSection(index: number) {
    this.createOrUpdateItemFlow.removeSection(index)
  }
}
