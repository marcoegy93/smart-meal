import { Component, OnInit } from '@angular/core';
import { Section } from "../../../../domain/model/Section";
import { OwlOptions } from "ngx-owl-carousel-o";
import { ItemsService } from "../../../../domain/service/ItemsService";
import { AuthService } from 'src/app/services/auth.service';
import { IItem } from "../../../../domain/model/IItem";
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { NotificationService } from 'src/domain/service/notification.service';

@Component({
  selector: 'app-sections-container',
  templateUrl: './sections-container.component.html',
  styleUrl: './sections-container.component.scss'
})
export class SectionsContainerComponent implements OnInit {
  public sections: Section[] = [];
  public restaurantId: string;
  public showFormToAddOrCreateSection: boolean = false;
  public managedSection: Section = {};
  public itemToUpdate?: {item?: IItem, index?: number, reset?: boolean};
  public indexOfExistingSection: number | undefined;
  public activateItemForm: boolean = false;
  public searchQuery: string = '';
  public filteredSections: Section[] = [];
  public showDeleteConfirmation: boolean = false;
  private sectionToDelete?: Section;
  public showExistingSections: boolean = true;

  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    nav: true,
    navText: [
      '<span class="material-symbols-outlined">arrow_back_ios_new</span>',
      '<span class="material-symbols-outlined">arrow_forward_ios</span>',
    ],
    responsive: {
      0: {
        items: 1
      },
      450: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    }
  };

  constructor(
    private itemService: ItemsService, 
    private authService: AuthService,
    private firebaseStorageService: FirebaseStorageService,
    private notificationService: NotificationService
  ) {
    const id = this.authService.getUserData().restaurantId;
    this.restaurantId = id;
    this.itemService.getSections(id);
  }

  async ngOnInit() {
    this.sections = await this.itemService.getSections(this.restaurantId);
    this.filteredSections = this.sections;
  }

  public openContainer(section?: Section) {
    if (section) {
      this.managedSection = JSON.parse(JSON.stringify(section));
      this.activateItemForm = (
        this.managedSection.name != undefined && 
        this.managedSection.name.trim().length > 0 && 
        this.managedSection.type != undefined
      );
      this.showExistingSections = false;
    } else {
      this.managedSection = {};
      this.showExistingSections = true;
    }
    this.showFormToAddOrCreateSection = true;
  }

  public setCommonDataOnSection(section: Section): void {
    this.managedSection = section;
    this.activateItemForm = (
      this.managedSection.name != undefined && 
      this.managedSection.name.trim().length > 0 && 
      this.managedSection.type != undefined
    );
  }

  public async addItemOnSection(item?: {item: IItem, index?: number}) {
    if (!item) {
      this.itemToUpdate = undefined;
      return;
    }
    
    if (this.managedSection && !this.managedSection.items) {
      this.managedSection.items = [];
    }

    // Vérification si l'item existe déjà dans la section
    if (this.managedSection.items?.some(existingItem => 
        !item.item.hasChange && 
        existingItem.itemId !== undefined && 
        existingItem.itemId === item.item.itemId)) {
      this.notificationService.send(NotificationService.getAnError("Cette section contient déjà cet item"));
      return;
    }

    if (this.managedSection) {
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

  private reset() {
    this.managedSection = {};
    this.indexOfExistingSection = undefined;
  }

  closeContainer() {
    this.reset();
    this.showFormToAddOrCreateSection = false;

  }

  updateItem(item: {item?: IItem, index?: number, reset?: boolean}) {
    this.itemToUpdate = item;
  }

  onSearch(event: any) {
    const query = event.target?.value || '';
    this.searchQuery = query.toLowerCase();
    this.filterSections();
  }

  private filterSections() {
    if (!this.searchQuery) {
      this.filteredSections = this.sections;
      return;
    }

    this.filteredSections = this.sections.filter(section => {
      return (
        section.name?.toLowerCase().includes(this.searchQuery) ||
        section.type?.toLowerCase().includes(this.searchQuery) ||
        section.items?.some(item => 
          item.name?.toLowerCase().includes(this.searchQuery) ||
          item.categories?.some(cat => cat.toLowerCase().includes(this.searchQuery))
        )
      );
    });
  }

  onDeleteSection(section: Section) {
    this.sectionToDelete = section;
    this.showDeleteConfirmation = true;
  }

  async confirmDelete() {
    if (!this.sectionToDelete?.sectionId) return;

    try {
      await this.itemService.deleteSection(this.sectionToDelete.sectionId);
      this.showDeleteConfirmation = false;
      this.sectionToDelete = undefined;
      
      this.sections = await this.itemService.getSections(this.restaurantId);
      this.filteredSections = this.sections;
      
      this.notificationService.send(NotificationService.getAnInfo('Section supprimée avec succès', []));
    } catch (error: any) {
      // Si le status est 200, c'est que la suppression a réussi malgré l'erreur de parsing
      if (error.status === 200) {
        this.showDeleteConfirmation = false;
        this.sectionToDelete = undefined;
        this.sections = await this.itemService.getSections(this.restaurantId);
        this.filteredSections = this.sections;
        this.notificationService.send(NotificationService.getAnInfo('Section supprimée avec succès', []));
      } else {
        console.error('Error deleting section:', error);
        this.notificationService.send(NotificationService.getAnError('Erreur lors de la suppression de la section', []));
      }
    }
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.sectionToDelete = undefined;
  }

  getEmptyStateText(): string {
    return "Aucune section n'a encore été ajoutée";
  }
}
