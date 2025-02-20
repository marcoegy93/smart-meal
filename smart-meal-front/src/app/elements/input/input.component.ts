import { Component, ElementRef, forwardRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatChipEditedEvent, MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { MatSelectChange } from "@angular/material/select";

export interface Key {
  name: string;
}
export interface SelectValue {
  value: string
  display: string
}
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {

  @Input()
  public icon!: string

  @Input()
  public note!: string

  @Input()
  public subject!: string

  @Input()
  public placeholder!: string

  @Input()
  public type!: string

  @Input()
  public for!: string

  @Input()
  public selectValues!: SelectValue[]

  @Input()
  public disabled!: boolean

  public _value: any;

  onChange: any = (obj: any) => { };
  onTouched: any = () => { };

  @Input() formControl = new FormControl();

  compareFn(s1: SelectValue, s2: SelectValue): boolean {
    return s1 && s2 ? s1.value === s2.value : s1 === s2;
  }

  writeValue(obj: any | any[]): void {
    if (obj) {
      this._value = obj as string[]
      if (this.type == 'picker') {
        this.fruits = obj
      }
    }
    this.formControl.setValue(obj, { emitEvent: false })
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
    this.formControl.valueChanges.subscribe(fn)
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  
  setDisabledState(isDisabled: boolean): void {
    if (this.disabled) {
        this.formControl.disable();
    } else {
        this.formControl.enable();
    }
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];

  @Input()
  pickerSelectedValues: string[] = [];

  @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);
  addFromInput: boolean = true;

  constructor() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.pickerSelectedValues.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    console.log(event.value)
    this.addFromInput = true
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
      this.onChange(this.fruits);
    }

    console.log(this.fruits)

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  startsWithCheck(mainStr: string, searchString: string): boolean {
    return mainStr.toLowerCase().startsWith(searchString.toLowerCase());
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.onChange(this.fruits);

      this.announcer.announce(`Removed ${fruit}`);
    }

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    if (this.addFromInput) {
      this.remove(this.fruits[this.fruits.length - 2])
      this.addFromInput = false
    }
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    this.onChange(this.fruits);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.pickerSelectedValues.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  onSelectionChange($event: MatSelectChange) {
    this.onChange(this._value);
    this.onTouched();
  }
}
