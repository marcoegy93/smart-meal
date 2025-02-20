import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DurationType, GetAllItemsCriteria } from 'src/domain/model/input/GetAllItemsCriteria';
import { ItemsService } from 'src/domain/service/ItemsService';
import { OrderCacheService } from 'src/infra/cache/OrderCacheService';

@Component({
  selector: 'app-item-criteria-form',
  templateUrl: './item-criteria-form.component.html',
  styleUrl: './item-criteria-form.component.scss'
})
export class ItemCriteriaFormComponent {
  @Input() filterItemsByCriteria!: (criteria: GetAllItemsCriteria) => void;
  // @Output() criteriaSubmit = new EventEmitter<GetAllItemsCriteria>();

  private restaurantId: string;
  criteriaForm: FormGroup;
  durations = Object.values(DurationType);
  durationLabels = {
    [DurationType.UNDER_5]: 'Moins de 5 minutes',
    [DurationType.UNDER_15]: 'Moins de 15 minutes',
    [DurationType.UNDER_30]: 'Moins de 30 minutes'
  };
  categories: string[] = [];
  ingredients: string[] = [];
  @Input() onCancel?: () => void;

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private orderCacheService: OrderCacheService,
    private route: ActivatedRoute) {
    this.restaurantId = this.route.snapshot.queryParams['restaurantId'];
    const criteria = this.orderCacheService.getItemCriteria();
    console.log('found criteria', criteria)

    this.criteriaForm = this.fb.group({
      categories: [criteria?.categories ?? []],
      ingredients: [criteria?.ingredients ?? []],
      priceMin: [criteria?.minPrice ?? null, [Validators.min(0)]],
      priceMax: [criteria?.maxPrice ?? null, [Validators.min(0)]],
      duration: [criteria?.duration ?? ''],
    });
  }

  async ngOnInit(): Promise<void> {
    this.categories = await this.itemsService.getCategories(this.restaurantId);
    this.ingredients = await this.itemsService.getIngredients(this.restaurantId);
  }

  onReset(): void {
    this.orderCacheService.saveItemCriteria({})
    this.filterItemsByCriteria({});
  }

  onSubmit(): void {
    console.log("Submitted")
    if (this.criteriaForm.valid) {
      const formValue = this.criteriaForm.value;

      const criteria: GetAllItemsCriteria = {
        categories: formValue.categories.length > 0 ? formValue.categories : undefined,
        ingredients: formValue.ingredients.length > 0 ? formValue.ingredients : undefined,
        minPrice: formValue.priceMin,
        maxPrice: formValue.priceMax,
        duration: formValue.duration || undefined,
      };
      this.orderCacheService.saveItemCriteria(criteria)

      this.filterItemsByCriteria(criteria);
    }
  }
}
