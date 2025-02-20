import {Component, Input, numberAttribute} from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.scss'
})
export class AddButtonComponent {

  @Input({transform: numberAttribute})
  public size!: number

  @Input()
  public type!: string
}
