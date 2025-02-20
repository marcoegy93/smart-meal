import {Component, Input} from '@angular/core';
import {ItemFlowService} from "../../../flow/item-flow.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input()
  public for: string = ""

  constructor(public service: ItemFlowService) {
  }

  hide() {
  }

  closeModal() {
    if(this.for == "SECTION"){
      this.service.displaySectionModal.next(false)
    }
    if(this.for == "ITEM"){
      this.service.displayItemModal.next(false)
    }
  }
}
