import {Component, Input} from '@angular/core';
import {NotificationService, Error} from "../../domain/service/notification.service";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

  public error: Error | undefined;

  constructor(private errorService: NotificationService) {
    this.errorService.currentError.subscribe((error) => {
      if(error) {
        this.error = error

        setTimeout(() => {
          this.error = undefined
        }, 2000)
      }
    })
  }
}
