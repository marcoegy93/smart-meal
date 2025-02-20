import {Injectable} from '@angular/core';
import {IItem, ItemType} from "../../domain/model/IItem";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";
import {CheckItem} from "./check/CheckItem";
import {Section} from "../../domain/model/Section";
import {CheckSection} from "./check/CheckSection";
import {Items} from "../../domain/external/Items";
import {GetAllItemsCriteria} from "../../domain/model/input/GetAllItemsCriteria";
import { AuthService } from '../services/auth.service';

export interface Error {
  type: string
  description: string,
  field?: string
}

@Injectable({
  providedIn: 'root'
})
export class ItemFlowService {

  private MISSING_FIELD: Error = {type: 'MISSING_FIELD', description: "Veuillez remplir tous les champs obligatoire"}

  private allItemSimpleCached: IItem[] = []

  private allSteps = [
    'ITEM',
    'SECTION'
  ]
  public stepFlow: string = this.allSteps[0];
  public displaySectionModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public displayItemModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public typeOfCreatingItem: BehaviorSubject<string> = new BehaviorSubject<string>("SIMPLE")
  public error: Subject<Error> = new Subject<Error>()

  public itemToCreateValue!: IItem;
  public itemToCreateObservable: BehaviorSubject<IItem> = new BehaviorSubject<IItem>({type: 'SIMPLE'})

  public attemptSectionToAddInItemValue: Section | undefined;
  public attemptSectionToAddInItemObservable: Subject<Section| undefined> = new Subject<Section| undefined>();

  public changeOnItemInSection: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public restaurantId: string;

  constructor(private itemsRepository: Items, private authService: AuthService) {
  this.restaurantId = this.authService.getUserData().restaurantId;
    this.itemToCreateObservable.subscribe((value) => {
      this.itemToCreateValue = value
    })

    this.attemptSectionToAddInItemObservable.subscribe((value) => {
      this.attemptSectionToAddInItemValue = value
    })

    this.displaySectionModal.subscribe(value => {
      if(!value) {
        this.attemptSectionToAddInItemValue = undefined
        this.attemptSectionToAddInItemObservable.next(this.attemptSectionToAddInItemValue)
      }
    })
  }

  nextStep() {
    const index = this.allSteps.indexOf(this.stepFlow);

    if (this.itemToCreateValue) {
      if (this.stepFlow == this.allSteps[0] &&
        !CheckItem.checkValueMandatory(this.itemToCreateValue)) {
        this.error.next(this.MISSING_FIELD)
        throw new Error("ERROR")
      }
    }

    if (index < (this.allSteps.length - 1)) {
      this.stepFlow = this.allSteps[index + 1]
    }
  }

  private checkOnDataItem() {

    if (this.itemToCreateValue) {
      if (this.itemToCreateValue.type == 'SIMPLE' &&
        !CheckItem.checkValueMandatory(this.itemToCreateValue)) {
        console.log(this.itemToCreateValue)
        console.log("ERROR !! ")
        this.error.next(this.MISSING_FIELD)
      }
    } else {
      console.log("ERROR !! ")
      this.error.next(this.MISSING_FIELD)
    }
    return true;
  }

  previousStep() {
    const index = this.allSteps.indexOf(this.stepFlow);
    if (index > 0) {
      this.stepFlow = this.allSteps[index - 1]
    }
  }

  finish() {
    this.checkOnDataItem()
    this.itemsRepository.createOrUpdateItems(this.restaurantId, this.itemToCreateValue);
  }

  addItemInAttemptSection(item: IItem) {
    console.log(this.attemptSectionToAddInItemValue?.items)

    if(!CheckItem.checkValueMandatory(item)){
      console.log("ERROR !! ")
      this.error.next(this.MISSING_FIELD)
    }

    if(!this.attemptSectionToAddInItemValue?.items) {
      this.attemptSectionToAddInItemValue!.items = []
    }

    this.attemptSectionToAddInItemValue?.items?.push(item)
    this.attemptSectionToAddInItemObservable.next(this.attemptSectionToAddInItemValue)
    this.displayItemModal.next(false)
    console.log(this.attemptSectionToAddInItemValue?.items)
  }

  canAddItemOnAttemptSection(): boolean {
    if(!this.attemptSectionToAddInItemValue) {
      this.error.next(this.MISSING_FIELD)
      throw new Error("ERROR !! remplir d'abord le nom ")
    } else {
      return true
    }
  }

  addAttemptSectionInMainItem() {
    if(CheckSection.checkValueMandatory(this.attemptSectionToAddInItemValue)) {
      console.log("ERROR !! ")
      this.error.next(this.MISSING_FIELD)
    }

    if(!this.itemToCreateValue.sections){
      this.itemToCreateValue.sections = []
    }

    this.itemToCreateValue.sections.push(this.attemptSectionToAddInItemValue!)
    this.itemToCreateObservable.next(this.itemToCreateValue);
    this.displaySectionModal.next(false)
    console.log(this.itemToCreateValue)
  }
  public async getAllCategories(): Promise<string[]> {
    return await this.itemsRepository.getAllCategories(this.restaurantId)
  }

  public async getAllKeywords(): Promise<string[]> {
    return await this.itemsRepository.getAllKeywords(this.restaurantId)
  }

  public async getAllIngredients(): Promise<string[]> {
    return await this.itemsRepository.getAllIngredients(this.restaurantId)
  }

  async getAllSimpleItems()  {
    //TODO cached this call
    const criteria: GetAllItemsCriteria = {restaurantId: this.restaurantId, type: ItemType.SIMPLE.toString()}
    return await this.itemsRepository.getAllItems(criteria)
  }

}
