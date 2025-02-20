import { Component } from '@angular/core';
import {AppModule} from "../../app.module";

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrl: './item-page.component.scss'
})
export class ItemPageComponent {
  public itemIsGood = false

  itemReceived() {
    this.itemIsGood = true;
  }
}
