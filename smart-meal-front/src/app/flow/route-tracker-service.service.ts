import { Injectable } from '@angular/core';
import {BehaviorSubject, filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RouteTrackerServiceService {

  private routeSegments$ = new BehaviorSubject<string[]>([]);

  constructor(private router: Router) {
    const initialSegments = this.getRouteSegments();
    this.routeSegments$.next(initialSegments);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const segments = this.getRouteSegments();
        this.routeSegments$.next(segments);
      });
  }

  private getRouteSegments(): string[] {
    const urlTree = this.router.parseUrl(this.router.url);
    return urlTree.root.children['primary']?.segments.map((s) => s.path) || [];
  }

  getRouteSegmentsObservable() {
    return this.routeSegments$.asObservable();
  }
}
