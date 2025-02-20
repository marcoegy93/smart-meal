import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCriteriaFormComponent } from './item-criteria-form.component';

describe('ItemCriteriaFormComponent', () => {
  let component: ItemCriteriaFormComponent;
  let fixture: ComponentFixture<ItemCriteriaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCriteriaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemCriteriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
