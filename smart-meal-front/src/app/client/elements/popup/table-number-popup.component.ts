import { Component } from '@angular/core';
import { ItemFlowService } from "../../../flow/item-flow.service";
import { Section } from "../../../../domain/model/Section";
import { CreateOrUpdateItemFlow } from "../../../flow/CreateOrUpdateItemFlow";
import { IItem, ItemType } from "../../../../domain/model/IItem";
import { Item } from "../../../../domain/model/Item";
import { StepManagerService } from "../../../flow/step-manager.service";
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';

@Component({
  selector: 'app-table-number-popup',
  templateUrl: './table-number-popup.component.html',
  styleUrl: './table-number-popup.component.scss'
})
export class TableNumberPopup {

  public showFormToAddOrCreateSection: boolean = false
  public sections: Section[] = []
  public managedSection: Section = {};
  public itemToUpdate?: { item?: IItem, index?: number, reset?: boolean }
  public indexOfExistingSection: number | undefined;
  public activateItemForm: boolean = false;

  constructor(public legacyService: ItemFlowService,
    private createOrUpdateItemFlow: CreateOrUpdateItemFlow,
    private stepManager: StepManagerService,
    private firebaseStorageService: FirebaseStorageService) {
    console.log(this.managedSection)
    this.stepManager.updateCurrentStep('SECTION')


    this.createOrUpdateItemFlow.getLiveItem().subscribe(item => {
      console.log(item)
      this.sections = item.sections ?? []
      console.log(this.sections)
    })
  }

  public openContainer(section?: Section, index?: number) {
    if (section) {
      console.log(section)
      this.managedSection = section
      this.indexOfExistingSection = index
      this.activateItemForm = (this.managedSection.name != undefined && this.managedSection.name.trim().length > 0 && this.managedSection.type != undefined)

    }
    this.showFormToAddOrCreateSection = true
  }

    closeContainer() {
    this.reset()
    this.showFormToAddOrCreateSection = false
  }

  public setCommonDataOnSection(section: Section): void {
    console.log(section)
    this.managedSection = section

    this.activateItemForm = (this.managedSection.name != undefined && this.managedSection.name.trim().length > 0 && this.managedSection.type != undefined)
  }

  public async addItemOnSection(item?: { item: IItem, index?: number }) {
    if (!item) {
      this.itemToUpdate = undefined
      return
    }
    if (this.managedSection && !this.managedSection.items) {
      this.managedSection.items = []
    }

    if (this.managedSection) {
      console.log(this.managedSection)
      console.log(item)

      if (item) {
        if (item.index != undefined && this.managedSection.items) {
          this.managedSection.items[item.index] = item.item;
        } else {
          if (item.item.selectedIllustration) {
            const filePath = `images/items/${new Date().getTime()}_${item.item.selectedIllustration.name}`
            const uploadedUrl = await this.firebaseStorageService.uploadFile(item.item.selectedIllustration, filePath);
            item.item.illustration = uploadedUrl;
            delete item.item.selectedIllustration;
          }
          this.managedSection.items?.push(item.item)
        }
      }

      this.managedSection = JSON.parse(JSON.stringify(this.managedSection))
    }
  }

  public addSectionOnMainItem() {
    this.createOrUpdateItemFlow.addSection(this.managedSection!, this.indexOfExistingSection)
    this.activateItemForm = false
    this.reset();
    this.closeContainer()
  }

  private reset() {
    this.managedSection = {}
    this.indexOfExistingSection = undefined
  }



  updateItem(item: { item?: IItem, index?: number, reset?: boolean }) {
    console.log(item)
    this.itemToUpdate = item
  }

  removeSection(index: number) {
    this.createOrUpdateItemFlow.removeSection(index)
  }
}
