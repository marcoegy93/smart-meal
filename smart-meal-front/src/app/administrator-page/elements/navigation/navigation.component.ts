import {Component, OnInit} from '@angular/core';
import {RouteTrackerServiceService} from "../../../flow/route-tracker-service.service";
import {Router} from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {

  public currentPage: string = '';
  public showDeconnexionConfirmation: boolean = false;
  constructor(private routeTracker: RouteTrackerServiceService, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.routeTracker.getRouteSegmentsObservable().subscribe((value) => {
      this.currentPage = value[value.length - 1]
    })
  }

  confirmDeconnexion(): void {
    this.authService.logout();
  }

  cancelDeconnexion(): void {
    this.showDeconnexionConfirmation = false;
  }

  requestDeconnexion(): void {
    this.showDeconnexionConfirmation = true;
  }

  onLogoClick(): void {
    this.router.navigate(['/']);
  }

  navigate(text: string): void{
    this.router.navigate(['administration/' + text])
  }

}
