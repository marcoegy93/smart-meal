import {Component, Input, numberAttribute} from '@angular/core';

@Component({
  selector: 'app-google-icon',
  templateUrl: './google-icon.component.html',
  styleUrl: './google-icon.component.scss'
})
export class GoogleIconComponent {

  @Input()
  public name!: string

  @Input({transform: numberAttribute})
  public size!: number
}
