import {Component, Inject, Injectable} from '@angular/core';
import {Items} from "../domain/external/Items";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private items: Items) {
  }
}
