import {Component, EventEmitter, Injectable, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Item} from "../../../../domain/model/Item";
import {IItem, ItemType} from "../../../../domain/model/IItem";
import {OwlOptions} from "ngx-owl-carousel-o";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {ItemsService} from "../../../../domain/service/ItemsService";
import {ItemFlowService} from "../../../flow/item-flow.service";
import {filter, map, Observable} from "rxjs";
import {RouteTrackerServiceService} from "../../../flow/route-tracker-service.service";
import {CreateOrUpdateItemFlow} from "../../../flow/CreateOrUpdateItemFlow";
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/domain/service/notification.service';

@Component({
  selector: 'app-items-container',
  templateUrl: './items-container.component.html',
  styleUrl: './items-container.component.scss'
})
export class ItemsContainerComponent implements OnInit, OnDestroy {

  public currentSubRoute: string[] = []
  public displayedItemsForm = false
  public items: IItem[] = []
  public categories: string[] = []
  // public restaurantId = ItemFlowService.;
  public routeSegments$: Observable<string[]> | undefined;
  @Output()
  dataRetrieved : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  public isOnMainPage: boolean = false;

  public selectedCategories: Set<string> = new Set();
  public filteredItems: IItem[] = [];
  public searchQuery: string = '';
  public showDeleteConfirmation: boolean = false;
  private itemToDelete?: IItem;

  constructor(private activateRoute: ActivatedRoute,
              private router: Router,
              private itemService: ItemsService,
              private routeTracker: RouteTrackerServiceService,
              private createOrUpdateItemFlow: CreateOrUpdateItemFlow,
              private authService: AuthService,
              private notificationService: NotificationService) {

  }

  ngOnDestroy(): void {
       console.log("item container d")
  }



  async ngOnInit() {
    console.log("j'init")
    await this.init();
    this.createOrUpdateItemFlow.actionToUpdateOrCreate.subscribe(async () => {
      await this.init()
    });
    this.filteredItems = this.items; // Initialisation des items filtrés
  }

  private async init() {
    // Réinitialiser les filtres
    this.selectedCategories.clear();
    this.searchQuery = '';
    
    this.categories = await this.itemService.getCategories(this.authService.getUserData().restaurantId)
    this.items = await this.itemService.getItems(this.authService.getUserData().restaurantId)
    console.log(this.items)
    this.routeTracker.getRouteSegmentsObservable().subscribe((value) => {

      this.currentSubRoute = value;
      this.createOrUpdateItemFlow.currentSubRoute.next(value)
      const containRouteToUpdate = value.filter(route => route === 'manage-items');

      if (containRouteToUpdate.length > 0) {
        this.displayedItemsForm = true;
      } else {
        this.displayedItemsForm = false;
      }
    })
    this.dataRetrieved.next(true)
    this.filteredItems = this.items;
  }

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

  seeOrUpdateItem(item: IItem) {
    this.router.navigate(['administration/dashboard/manage-items/items'], {
      queryParams: { id: item.itemId },
    });
  }

  close() {
    if (this.currentSubRoute.length > 1) {
      this.router.navigate(['administration/dashboard']);
    }
  }

  addItem() {
    this.router.navigate(['/manage-items/items']);
  }

  toggleCategory(category: string) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.filterItems();
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.has(category);
  }

  onSearch(event: any) {
    const query = event.target?.value || '';
    this.searchQuery = query.toLowerCase();
    this.filterItems();
  }

  private filterItems() {
    let filtered = this.items;

    // Filtre par catégories sélectionnées
    if (this.selectedCategories.size > 0) {
      filtered = filtered.filter(item => {
        if (!item.categories) return false;
        return item.categories.some(category => this.selectedCategories.has(category));
      });
    }

    // Filtre par recherche
    if (this.searchQuery) {
      filtered = filtered.filter(item => {
        return (
          item.name?.toLowerCase().includes(this.searchQuery) ||
          item.categories?.some(cat => cat.toLowerCase().includes(this.searchQuery)) ||
          item.ingredients?.some(ing => ing.toLowerCase().includes(this.searchQuery)) ||
          item.keywords?.some((key: string) => key.toLowerCase().includes(this.searchQuery))
        );
      });
    }

    this.filteredItems = filtered;
  }

  onDeleteItem(item: IItem) {
    this.itemToDelete = item;
    this.showDeleteConfirmation = true;
  }

  async confirmDelete() {
    if (!this.itemToDelete?.itemId) return;

    try {
      await this.itemService.deleteItem(this.itemToDelete.itemId);
      this.showDeleteConfirmation = false;
      this.itemToDelete = undefined;
      
      await this.init();
      this.filterItems();
      
      this.notificationService.send(NotificationService.getAnInfo('Produit supprimé avec succès', []));
    } catch (error: any) {
      // Si le status est 200, c'est que la suppression a réussi malgré l'erreur de parsing
      if (error.status === 200) {
        this.showDeleteConfirmation = false;
        this.itemToDelete = undefined;
        await this.init();
        this.filterItems();
        this.notificationService.send(NotificationService.getAnInfo('Produit supprimé avec succès', []));
      } else {
        console.error('Error deleting item:', error);
        this.notificationService.send(NotificationService.getAnError('Erreur lors de la suppression du produit', []));
      }
    }
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.itemToDelete = undefined;
  }
}
