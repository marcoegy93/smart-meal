import { Component } from '@angular/core';
import { CreateOrUpdateItemFlow } from "../../flow/CreateOrUpdateItemFlow";
import { Router } from "@angular/router";

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrl: './done.component.scss'
})
export class DoneComponent {
  constructor(private createOrUpdateItemFlow: CreateOrUpdateItemFlow, private router: Router) {
    if (this.createOrUpdateItemFlow.toUpdate) {
      this.createOrUpdateItemFlow.currentSubRoute.subscribe((value) => {
        if (value.length > 1) {
          const parentPath = value.slice(0, -2).join('/');
          console.log(parentPath);
          this.router.navigate([`${parentPath}`]);
        }
      }).unsubscribe()
    } else {
      this.createOrUpdateItemFlow.getLiveItem().subscribe(item => {
        console.log(item)
        if (item.name == undefined) {
          this.router.navigate(['/manage-items/items'])
        }
      }).unsubscribe()
    }

  }

  navigateToManageItems() {
    this.router.navigate(['/manage-items/items'])
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/administration/dashboard'])
  }

}
