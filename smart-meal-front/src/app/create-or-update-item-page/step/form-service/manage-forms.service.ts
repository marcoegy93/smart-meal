import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManageFormsService {

  public hasErrorOnItemForm: boolean = true;
  public hasErrorOnSectionForm: boolean = true;
  public hasErrorOnSectionStep: boolean = true;

  constructor() { }

  public handleItemFormValues(formIsValid: boolean){
    this.hasErrorOnItemForm = !formIsValid;
  }

  public handleSectionFormValues(formIsValid: boolean, sizeOfItems?: number){
    this.hasErrorOnSectionForm = !formIsValid || (sizeOfItems == undefined || sizeOfItems == 0);
  }

  public handleSectionStep(sizeOfSections?: number){
    this.hasErrorOnSectionStep = sizeOfSections == undefined || sizeOfSections == 0;
  }
}
