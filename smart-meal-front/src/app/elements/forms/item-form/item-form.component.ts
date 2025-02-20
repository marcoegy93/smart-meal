import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IItem} from "../../../../domain/model/IItem";
import {SelectValue} from "../../input/input.component";
import {Section} from "../../../../domain/model/Section";
import {ItemsService} from "../../../../domain/service/ItemsService";
import {CreateOrUpdateItemFlow} from "../../../flow/CreateOrUpdateItemFlow";
import {NotificationService, Error} from "../../../../domain/service/notification.service";
import {ManageFormsService} from "../../../create-or-update-item-page/step/form-service/manage-forms.service";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent implements OnInit, OnChanges, OnDestroy {
  public selectedFilePreview: string | undefined;

  @Input()
  public allowChoosingExistingItem = false
  public connectedSession!: Section
  public itemForSelecting: SelectValue[] = []
  public categories: string[] = []
  public ingredients: string[] = []
  public allItems: IItem[] = []
  public keywords: string[] = []
  public itemForm!: FormGroup;
  public displayRadioBoxToUpdate: boolean = false
  public initialSelectedItem?: IItem
  public restaurantId: string;

  @Input()
  public isActive: boolean = true

  @Input()
  public itemToUpdate?: { item?: IItem, index?: number, reset?: boolean }

  public selectedFile: File | null = null;

  @Output()
  public managedItemEvent: EventEmitter<{ item: IItem, index?: number }> = new EventEmitter()
  public subscriptionToAction: any;

  constructor(private formBuilder: FormBuilder,
              private service: ItemsService,
              private createOrUpdateItemFlow: CreateOrUpdateItemFlow,
              private errorService: NotificationService,
              private manageFormService: ManageFormsService,
              private authService: AuthService) {
              const id =
    this.restaurantId = this.authService.getUserData().restaurantId;
    this.createForm()
    this.subscriptionToAction = this.createOrUpdateItemFlow.setCommonData.subscribe((s) => {
      console.log("JE CLIQUE " + s)
      this.bindingFormItemData();
    })
  }

  ngOnDestroy(): void {
    console.log("je me detru")
    this.managedItemEvent.emit(undefined)
    this.subscriptionToAction.unsubscribe();
  }

  async ngOnInit() {
    await this.fetchAllSimpleItem()
    await this.fetchAllCategories()
    await this.fetchAllIngredients()
    await this.fetchAllKeyword()
    this.updateFormWithCurrentItemBuildingData();
    this.handleSelectedItem()
    this.bindingFormChange()
  }

  isUpdating(): boolean {
    if(this.initialSelectedItem) {
      return false;
    }else if(this.itemToUpdate?.item) {
      return true;
    }
    return this.createOrUpdateItemFlow.toUpdate
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemToUpdate'] && this.itemToUpdate) {
      console.log(this.itemToUpdate)

        this.resetAllFields()
        this.initialSelectedItem = undefined

      if(this.itemToUpdate.item){
        this.patchCommonFormData(this.itemToUpdate.item)
      }
    }
  }

  private async fetchAllSimpleItem() {
    this.allItems = await this.service.getItems(this.restaurantId, "SIMPLE")
    this.allItems.forEach((item) => this.itemForSelecting.push({value: item.itemId!, display: item.name!}))
  }

  private async fetchAllCategories() {
    this.categories = await this.service.getCategories(this.restaurantId)
  }

  private async fetchAllIngredients() {
    this.ingredients = await this.service.getIngredients(this.restaurantId)
  }

  private async fetchAllKeyword() {
    this.keywords = await this.service.getKeywords(this.restaurantId)
  }

  private handleSelectedItem() {
    if (this.allowChoosingExistingItem) {
      this.itemForm.get("selectedItem")?.valueChanges.subscribe((value) => {
        if (value != null) {
          const item = this.findItemById(value.value);
          this.initialSelectedItem = JSON.parse(JSON.stringify(item))
          this.patchCommonFormData(item)
        }
      })
    }
  }

  private updateFormWithCurrentItemBuildingData() {
    if (this.isMainFormForItem()) {
      this.createOrUpdateItemFlow.getLiveItem().subscribe((item) => {
        console.log("okok")
        console.log(item)
        this.patchCommonFormData(item)
      })
    }
  }

  private patchCommonFormData(item: IItem) {
    const typeOfItemAsSelectValue: SelectValue = {value: item.type, display: item.type}
    this.itemForm.patchValue({
      name: item.name,
      description: item.description,
      type: typeOfItemAsSelectValue,
      keyword: item.keywords,
      ingredients: item.ingredients,
      categories: item.categories,
      duration: item.duration,
      price: item.price,
      status: item.status,
      updateItem: item.toUpdate
    });
    if (item.selectedIllustration) {
      this.selectedFile = item.selectedIllustration;
      this.selectedFilePreview = URL.createObjectURL(item.selectedIllustration);
    } else if (item.illustration) {
      this.selectedFilePreview = item.illustration;
    }    
  }

  private resetAllFields() {
    console.log("je reset")
    this.itemForm.patchValue({
      keyword: [],
      ingredients: [],
      categories: [],
    });
    this.itemForm.reset()
    this.displayRadioBoxToUpdate = false
  }

  private findItemById(id: string) {
    return this.allItems.find(item => item.itemId === id)!;
  }

  private createForm() {
    const valueOnForm: SelectValue = {value: 'SIMPLE', display: 'SIMPLE'}
    this.itemForm = this.formBuilder.group({
      selectedItem: [undefined],
      type: [valueOnForm, [Validators.required]],
      name: [undefined, [Validators.required]],
      description: [undefined, [Validators.required]],
      keyword: [undefined, [Validators.required]],
      ingredients: [undefined, [Validators.required]],
      categories: [undefined, [Validators.required]],
      duration: [undefined, [Validators.required, Validators.pattern(/^\d+$/)]],
      price: [undefined, [Validators.required, Validators.pattern(/^\d+$/)]],
      status: ['ACTIVE'],
      illustration: [undefined],
      updateItem: [false]
    });
  }

  private isMainFormForItem() {
    return !this.allowChoosingExistingItem
  }

  getInvalidFields(): string[] {
    const invalidFields: string[] = [];
    const controls = this.itemForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalidFields.push(name);
      }
    }

    return invalidFields;
  }

  private bindingFormItemData() {
    console.log(this.itemForm.value)
    console.log(this.selectedFilePreview)
    if(!this.itemForm.valid){
      const error: Error = {
        message: 'Des erreurs se trouvent dans le formulaire',
        type: "ERROR",
        additionalDetails: this.getInvalidFields()
      }
      this.errorService.send(error)
      return
    }

    if (this.itemForm.value['type'] != null) {
      const item: IItem = {
        type: this.itemForm.value['type'].value,
        name: this.itemForm.value['name'] == "" ? undefined : this.itemForm.value['name'],
        description: this.itemForm.value['description'] == "" ? undefined : this.itemForm.value['description'],
        keywords: this.itemForm.value['keyword'],
        ingredients: this.itemForm.value['ingredients'],
        categories: this.itemForm.value['categories'],
        duration: this.itemForm.value['duration'] == "" ? undefined : parseInt(this.itemForm.value['duration']),
        price: this.itemForm.value['price'] == "" ? undefined : parseInt(this.itemForm.value['price']),
        itemId: this.initialSelectedItem?.itemId,
        status: this.initialSelectedItem?.status??'ACTIVE',
        illustration: this.selectedFilePreview,
        selectedIllustration: this.selectedFile ? this.selectedFile : undefined,
        from: this.initialSelectedItem
      }

      if (this.isMainFormForItem()) {
        console.log(item)
        console.log(this.itemForm.value)
        this.createOrUpdateItemFlow.setCommonItemData(item);
      }
    }
  }

  onFileSelected(modifiedFile: File | null): void {
    if (modifiedFile) {
      this.selectedFile = modifiedFile;
      this.selectedFilePreview = URL.createObjectURL(modifiedFile);
      console.log('Image modifiée reçue dans le parent', modifiedFile);
    } else {
      this.selectedFile = null;
      this.selectedFilePreview = undefined;
      console.log('Aucune image sélectionnée, réinitialisation.');
    }
  }

  public bindingFormChange() {
    this.itemForm.valueChanges.subscribe((itemForm) => {
      this.manageFormService.handleItemFormValues(this.itemForm.valid)
      let from: IItem | undefined;
      if(this.initialSelectedItem) {
        from = this.initialSelectedItem
      }else {
        from = this.itemToUpdate?.item?.itemId && !this.itemToUpdate?.item.from ? this.itemToUpdate?.item : this.itemToUpdate?.item?.from
      }
      console.log(this.itemToUpdate)
      if (!this.isMainFormForItem()) {
        const item: IItem = {
          type: itemForm.type.value,
          name: itemForm.name,
          description: itemForm.description,
          keywords: itemForm.keyword,
          ingredients: itemForm.ingredients,
          categories: itemForm.categories,
          duration: parseInt(itemForm.duration),
          price: parseInt(itemForm.price),
          itemId: this.itemToUpdate?.item?.itemId??this.initialSelectedItem?.itemId,
          status: this.itemToUpdate?.item?.status??this.initialSelectedItem?.status,
          illustration: this.itemToUpdate?.item?.illustration??this.initialSelectedItem?.illustration,
          toUpdate: itemForm.updateItem,
          from: from
        }
        console.log(this.initialSelectedItem)
        console.log(item)
        console.log(this.itemToUpdate)
        const itemWithoutFrom = {...item, from: undefined}
        this.displayRadioBoxToUpdate = !this.compareItem(itemWithoutFrom, item.from)
      } else {
        this.createOrUpdateItemFlow.updateType(itemForm.type.value)
      }
    })
  }

  public async addItemInSection() {

    if(this.manageFormService.hasErrorOnItemForm) {
      this.errorService.send({message: "Le produit n'est pas complet"})
      return
    }

    let from: IItem | undefined;
    if(this.initialSelectedItem) {
      from = this.initialSelectedItem
    }else {
      from = this.itemToUpdate?.item?.itemId && !this.itemToUpdate?.item.from ? this.itemToUpdate?.item : this.itemToUpdate?.item?.from
    }

    const itemToAdd: IItem = {
      type: this.itemForm.value['type'].value,
      itemId: this.itemForm.value['selectedItem'] ? this.itemForm.value['selectedItem'].value : this.itemToUpdate?.item?.itemId,
      name: this.itemForm.value['name'] == "" ? undefined : this.itemForm.value['name'],
      description: this.itemForm.value['description'] == "" ? undefined : this.itemForm.value['description'],
      keywords: this.itemForm.value['keyword'],
      ingredients: this.itemForm.value['ingredients'],
      categories: this.itemForm.value['categories'],
      duration: this.itemForm.value['duration'] != undefined ? parseInt(this.itemForm.value['duration']) : undefined,
      price: this.itemForm.value['price'] == "" ? undefined : parseInt(this.itemForm.value['price']),
      illustration: this.selectedFile ? await this.uploadImage(this.selectedFile) : (from?.illustration ?? undefined),
      selectedIllustration: this.selectedFile == undefined ? undefined : this.selectedFile,
      status: this.itemForm.value['status'] == null || this.itemForm.value['status'] == "" ? 'ACTIVE' : this.itemForm.value['status'],
      toUpdate: this.itemForm.value['updateItem'] ?? false,
      from: from
    };    

    itemToAdd.hasChange = !this.compareItem({...itemToAdd, from: undefined, toUpdate: undefined}, itemToAdd.from);
    
    if (itemToAdd.hasChange && this.initialSelectedItem) {
        itemToAdd.itemId = undefined;
    }

    const canUpdate = this.itemToUpdate && !itemToAdd.hasChange ? 
      false : itemToAdd.toUpdate;

    itemToAdd.toUpdate = canUpdate;

    console.log(itemToAdd)
    this.managedItemEvent.emit({item: itemToAdd, index: this.itemToUpdate?.index})
    this.resetAllFields()
    this.itemToUpdate = undefined
    this.displayRadioBoxToUpdate = false
    this.selectedFile = null
    this.selectedFilePreview = undefined
  }

  private compareItem(itemBase: IItem | undefined, itemTarget: IItem | undefined): boolean {
    if(itemBase && itemTarget){
      const itemBaseWithoutSection = {...itemBase, sections: undefined, restaurantId: undefined}
      const itemTargetWithoutSection = {...itemTarget, sections: undefined, restaurantId: undefined}
      //duplicate, must to move this in dedicated class
      if (!itemBase && itemTarget) {
        return true;
      }
  
      // @ts-ignore
      console.log(itemBaseWithoutSection.length)
      console.log(itemBaseWithoutSection)
      // @ts-ignore
      console.log(itemTargetWithoutSection)
  
      if (!itemBaseWithoutSection || !itemTargetWithoutSection) {
        return true;
      }
  
      const itemBaseAsJson = JSON.stringify(itemBaseWithoutSection, Object.keys(itemBaseWithoutSection).sort());
      const itemTargetAsJson = JSON.stringify(itemTargetWithoutSection, Object.keys(itemTargetWithoutSection).sort());
      return itemBaseAsJson === itemTargetAsJson
    }
    return true;
  }

  private async uploadImage(file: File): Promise<string> {
    if (file) {
        return await this.service.getUrlImage(file);
    }
    return "any";
  }
}
