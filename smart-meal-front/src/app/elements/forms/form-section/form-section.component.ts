import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AppModule} from "../../../app.module";
import {ItemFlowService} from "../../../flow/item-flow.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Section} from "../../../../domain/model/Section";
import {SelectValue} from "../../input/input.component";
import {IItem} from "../../../../domain/model/IItem";
import {CreateOrUpdateItemFlow} from "../../../flow/CreateOrUpdateItemFlow";
import {ItemsService} from "../../../../domain/service/ItemsService";
import {ManageFormsService} from "../../../create-or-update-item-page/step/form-service/manage-forms.service";
import {NotificationService} from "../../../../domain/service/notification.service";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-form-section',
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.scss'
})
export class FormSectionComponent implements OnInit, OnDestroy, OnChanges {

  public sectionForm!: FormGroup;
  public sectionTypes: SelectValue[] = [{value: "MAIN", display: "PRINCIPALE"}, { value: "ADDITIONAL", display: "ADDITIONNEL" }];
  public sectionSelectValue: SelectValue[] = [];
  public allSections: Section[] = [];
  public selectSection!: Section;
  public displayRadioBoxToUpdate: boolean = false;
  public showPositionInput: boolean = true;

  @Output() public managedSectionEvent: EventEmitter<Section> = new EventEmitter();
  @Output() public itemToUpdate: EventEmitter<{ item?: IItem, index?: number, reset?: boolean }> = new EventEmitter();
  @Output() public submitSection: EventEmitter<any> = new EventEmitter();
  
  @Input() public sectionFromScratch!: Section;

  @Input() public componentName!: string;

  @Input() public showExistingSections: boolean = true;

  constructor(private formBuilder: FormBuilder,
              public legacyService: ItemFlowService,
              public service: ItemsService,
              public createOrUpdateItemFlow: CreateOrUpdateItemFlow,
              private manageFormService: ManageFormsService,
              private errorService: NotificationService,
              private authService: AuthService,
              private router: Router) {

    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sectionFromScratch']) {
      console.log('ngOnChanges - sectionFromScratch:', this.sectionFromScratch);
      
      // Mettre à jour le formulaire d'abord
      if (this.sectionForm && this.sectionFromScratch) {
        this.sectionForm.patchValue({
          name: this.sectionFromScratch.name,
          typeOfSection: this.sectionTypes.find(type => type.value === this.sectionFromScratch.type),
          choiceMin: this.sectionFromScratch.choiceLimitMin,
          choiceMax: this.sectionFromScratch.choiceLimitMax,
          positionOfSection: this.sectionFromScratch.position,
          updateSection: this.sectionFromScratch.toUpdate  // Utiliser l'état existant
        });

        // Attendre le prochain cycle pour vérifier la validité
        setTimeout(() => {
          console.log('After patch - form values:', this.sectionForm.value);
          console.log('After patch - form valid:', this.sectionForm.valid);
          console.log('After patch - form errors:', this.sectionForm.errors);
          
          this.sectionFromScratch.hasChange = !this.compareSection(this.sectionFromScratch, this.sectionFromScratch.from);
          // Ne pas réinitialiser toUpdate, garder l'état existant
          this.displayRadioBoxToUpdate = this.componentName !== 'SectionsContainer' && 
                                          Boolean(this.sectionFromScratch.sectionId) && 
                                            this.sectionFromScratch.hasChange;
          this.manageFormService.handleSectionFormValues(this.sectionForm.valid, this.sectionFromScratch.items?.length);
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.sectionFromScratch = {} as Section;
  }

  public async ngOnInit() {
    await this.fetchAllSections();
    this.handleUpdatedSection();
    this.bindingSectionData();
    this.handleSelectedSection();
    this.showPositionInput = this.router.url.includes('/administration/dashboard/manage-items') || this.router.url.includes('/manage-items/sections') ;
  }

  private async fetchAllSections() {
    this.allSections = await this.service.getSections(this.authService.getUserData().restaurantId)
    this.allSections.forEach((section) => this.sectionSelectValue.push({
      value: section.sectionId!,
      display: section.name!
    }))
  }

  private handleSelectedSection() {
    this.sectionForm.get("selectedSection")?.valueChanges.subscribe((value) => {
      if (value) {
        this.selectSection = this.findSectionById(value.value);
        // Créer une copie profonde de la section sélectionnée
        const sectionCopy = JSON.parse(JSON.stringify(this.selectSection));
        
        // Assigner la section copiée à sectionFromScratch
        this.sectionFromScratch = sectionCopy;
        // Stocker la version originale dans from
        this.sectionFromScratch.from = JSON.parse(JSON.stringify(this.selectSection));
        
        this.sectionForm.patchValue({
          name: this.selectSection.name,
          typeOfSection: this.sectionTypes.find(type => type.value === this.selectSection.type),
          choiceMin: this.selectSection.choiceLimitMin,
          choiceMax: this.selectSection.choiceLimitMax
        });
      }
    });
  }

  private handleUpdatedSection() {
    this.sectionForm.patchValue({
      name: this.sectionFromScratch.name,
      typeOfSection: this.sectionTypes.find(type => type.value === this.sectionFromScratch.type),
      positionOfSection: this.sectionFromScratch.position,
      choiceMin: this.sectionFromScratch.choiceLimitMin,
      choiceMax: this.sectionFromScratch.choiceLimitMax,
      updateSection: this.sectionFromScratch.toUpdate
    });
  }

  private createForm() {
    this.sectionForm = this.formBuilder.group({
      selectedSection: [],
      name: [undefined, [Validators.required]],
      typeOfSection: [undefined, [Validators.required]],
      positionOfSection: [undefined, [Validators.required, Validators.min(1)]],
      choiceMin: [undefined, [Validators.required]],
      choiceMax: [undefined, [Validators.required]],
      updateSection: [false]
    })
  }

  private findSectionById(id: string) {
    return this.allSections.filter(section => section.sectionId === id)[0];
  }

  private bindingSectionData() {
    this.sectionForm.valueChanges.subscribe(valueForm => {
      this.sectionFromScratch.name = valueForm.name;
      this.sectionFromScratch.type = valueForm.typeOfSection?.value;
      
      // Vérifier si la position est 0 et la remplacer par undefined
      const position = valueForm.positionOfSection ? parseInt(valueForm.positionOfSection) : undefined;
      this.sectionFromScratch.position = position === 0 ? undefined : position;
      this.sectionFromScratch.choiceLimitMin = parseInt(valueForm.choiceMin);
      this.sectionFromScratch.choiceLimitMax = parseInt(valueForm.choiceMax);
      
      // Pour SectionsContainer, forcer toUpdate à true seulement en mode modification
      if (this.componentName === 'SectionsContainer') {
        if (this.sectionForm.get('selectedSection')?.value) {
          this.sectionFromScratch.toUpdate = false;
        } else {
          this.sectionFromScratch.toUpdate = Boolean(this.sectionFromScratch.sectionId);
        }
      } else {
        this.sectionFromScratch.toUpdate = valueForm.updateSection ?? false;
      }

      if (!this.sectionFromScratch.from) {
        this.sectionFromScratch.from = JSON.parse(JSON.stringify(this.sectionFromScratch));
      }
      
      this.sectionFromScratch.hasChange = !this.compareSection(this.sectionFromScratch, this.sectionFromScratch.from);
      this.displayRadioBoxToUpdate = this.componentName !== 'SectionsContainer' && 
                                    Boolean(this.sectionFromScratch.sectionId) && 
                                    this.sectionFromScratch.hasChange;
                           
      this.manageFormService.handleSectionFormValues(this.sectionForm.valid, this.sectionFromScratch.items?.length);
      this.managedSectionEvent.emit(this.sectionFromScratch);
    });
  }

  private compareItem(itemBase: IItem[] | undefined, itemTarget: IItem[] | undefined): boolean {
    if (!itemBase && !itemTarget) {
      return true;
    }

    if (!itemBase || !itemTarget || itemBase.length !== itemTarget.length) {
      return false;
    }

    // Liste des propriétés à comparer
    const propertiesToCompare = [
      'type',
      'itemId',
      'name',
      'description',
      'keywords',
      'ingredients',
      'categories',
      'duration',
      'price',
      'illustration',
      'status'
    ];

    const cleanAndSort = (item: IItem) => {
      const cleanItem: any = {};
      propertiesToCompare.forEach(prop => {
        if (item[prop as keyof IItem] !== undefined) {
          cleanItem[prop] = item[prop as keyof IItem];
        }
      });
      return JSON.stringify(cleanItem, Object.keys(cleanItem).sort());
    };

    const sortedArr1 = itemBase.map(cleanAndSort).sort();
    const sortedArr2 = itemTarget.map(cleanAndSort).sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
  }

  private compareSection(sectionBase: Section, sectionTarget?: Section) {
    if (sectionTarget && sectionBase) {
      return sectionBase.type === sectionTarget.type &&
        sectionBase.name === sectionTarget.name &&
        sectionBase.choiceLimitMax === sectionTarget.choiceLimitMax &&
        sectionBase.choiceLimitMin === sectionTarget.choiceLimitMin &&
        this.compareItem(sectionBase.items, sectionTarget.items);
    }
    return true;
  }

  public removeItem(index: number) {
    this.sectionFromScratch.items?.splice(index, 1)
    this.sectionFromScratch.hasChange  = !this.compareSection(this.sectionFromScratch, this.sectionFromScratch.from);
    this.displayRadioBoxToUpdate = this.componentName !== 'SectionsContainer' && 
                                    Boolean(this.sectionFromScratch.sectionId) && 
                                      this.sectionFromScratch.hasChange;
    this.managedSectionEvent.emit(this.sectionFromScratch)
    this.itemToUpdate.emit({reset: true})
    this.manageFormService.handleSectionFormValues(this.sectionForm.valid, this.sectionFromScratch.items?.length)
  }

  private processSection(section: Section): Section {
    // Nettoyer les items de la section
    function cleanItem(item: IItem): IItem {
      const { from, sections, ...cleanedItem } = item;

      if (item.toUpdate === undefined && item.hasChange === undefined) {
        const { from, sections, toUpdate, hasChange, ...cleanItem } = item;
        return cleanItem;
      }

      // Règles de nettoyage pour les items
      if (item.toUpdate === false && item.itemId !== undefined) {
        if (item.hasChange) {
          const { itemId, hasChange, toUpdate, ...remaining } = cleanedItem;
          return remaining;
        } else {
          const { from, sections, toUpdate, hasChange, ...cleanItem } = item;
          return cleanItem;
        }
      }

      if (item.toUpdate === true && item.itemId !== undefined) {
        const { toUpdate, ...remaining } = cleanedItem;
        return remaining;
      }

      if (item.toUpdate === true && item.itemId === undefined) {
        const { toUpdate, ...remaining } = cleanedItem;
        return remaining;
      }

      return cleanedItem;
    }

    // Nettoyer la section
    const { from, items, ...cleanedSection } = section;
    const cleanedItems = items?.map(cleanItem).filter(Boolean) || [];

    if (section.toUpdate === undefined && section.hasChange === undefined) {
      const { from, toUpdate, hasChange, ...cleanSection } = section;
      return { ...cleanSection, items: cleanedItems };
    }

    // Règles de nettoyage pour la section
    if (section.toUpdate === false && section.sectionId !== undefined) {
      if (section.hasChange) {
        const { sectionId, hasChange, toUpdate, ...remaining } = cleanedSection;
        return { ...remaining, items: cleanedItems };
      } else {
        const { from, toUpdate, hasChange, ...cleanSection } = section;
        return { ...cleanSection, items: cleanedItems };
      }
    }

    if (section.toUpdate === true && section.sectionId !== undefined) {
      const { toUpdate, ...remaining } = cleanedSection;
      return { ...remaining, items: cleanedItems };
    }

    if (section.toUpdate === true && section.sectionId === undefined) {
      const { toUpdate, ...remaining } = cleanedSection;
      return { ...remaining, items: cleanedItems };
    }

    return { ...cleanedSection, items: cleanedItems };
  }

  public async addSection() {
    if (this.componentName !== "SectionsContainer") {
      this.sectionFromScratch.hasChange = !this.compareSection(
        { ...this.sectionFromScratch, from: undefined },
        this.sectionFromScratch.from
      );

      // Ne mettre à jour toUpdate que si le toggle est explicitement activé
      this.sectionFromScratch.toUpdate = this.sectionForm.get('updateSection')?.value ?? false;

      console.log("Section à mettre à jour :", this.sectionFromScratch.toUpdate);
      this.managedSectionEvent.emit(this.sectionFromScratch);

      if (!this.sectionFromScratch.items?.length) {
        this.errorService.send({ message: "La section doit contenir au moins un produit" });
        return;
      }
      if (this.manageFormService.hasErrorOnSectionForm) {
        this.errorService.send({ message: "La section n'est pas complète" });
        return;
      }

      this.submitSection.emit();
      this.resetSectionForm();
    } else {
      if (this.sectionFromScratch.items && this.sectionFromScratch.items.length > 0) {
        await this.service.uploadItemIllustrations(this.sectionFromScratch.items);
      }
      
      // Vérifier si des changements ont été effectués
      const hasChanges = !this.compareSection(this.sectionFromScratch, this.sectionFromScratch.from);
      if (!hasChanges && this.componentName === 'SectionsContainer' && this.showExistingSections) {
        this.errorService.send({ message: "Veuillez changer des champs pour ajouter la section" });
        return;
      }
      
      // Traiter la section avant de l'envoyer
      const processedSection = this.processSection(this.sectionFromScratch);
      
      this.service
        .updateSection(this.authService.getUserData().restaurantId, processedSection)
        .then(() => {
          console.log("Section mise à jour avec succès !");
          this.submitSection.emit();
          this.resetSectionForm();
          window.location.reload();
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour de la section autonome :", error);
          this.errorService.send({
            message: "Une erreur est survenue lors de la mise à jour de la section.",
          });
        });
    }
  }
  
  
  private resetSectionForm() {
    this.sectionFromScratch = {} as Section;
    this.sectionForm.reset();
  }
   

  updateItem(item: IItem, index: number) {
    console.log(item)
    this.itemToUpdate.emit({item, index})
  }

  public getBtnText(): string {
    if (this.componentName === 'SectionsContainer') {
      if (this.sectionForm.get('selectedSection')?.value) {
        return 'Ajouter';
      }
      return this.sectionFromScratch?.sectionId ? 'Mettre à jour' : 'Ajouter';
    } else {
      if (this.showExistingSections) {
        return 'Ajouter';
      }
      return this.sectionFromScratch?.sectionId ? 'Mettre à jour' : 'Ajouter';
    }
  }
}
