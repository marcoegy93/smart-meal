import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent  {

  public itemIsGood = false

  itemReceived() {
    this.itemIsGood = true;
  }
}
