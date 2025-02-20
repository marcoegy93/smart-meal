import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Item} from "../../domain/model/Item";
import {ItemType} from "../../domain/model/IItem";

@Injectable({
  providedIn: 'root'
})
export class ManageItemsFlowService {

  private progressItem: BehaviorSubject<Item> = new BehaviorSubject<Item>(new Item(ItemType.SIMPLE));

  constructor() { }

  public patchItem(item: Item) {

  }
}
