import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateOrUpdateItemPageComponent} from "./create-or-update-item-page/create-or-update-item-page.component";
import {ItemStepComponent} from "./create-or-update-item-page/step/item-step/item-step.component";
import {SectionStepComponent} from "./create-or-update-item-page/step/section-step/section-step.component";
import {SummaryStepComponent} from "./create-or-update-item-page/step/summary-step/summary-step.component";
import {DoneComponent} from "./create-or-update-item-page/done/done.component";
import {AdministratorPageComponent} from "./administrator-page/administrator-page.component";
import {AccountPageComponent} from "./account-page/account-page.component";
import {
  CreateAccountContainerComponent
} from "./account-page/create-account-container/create-account-container.component";
import {LoginContainerComponent} from "./account-page/login-container/login-container.component";
import {ItemPageComponent} from "./administrator-page/item-page/item-page.component";
import { HomeComponent } from './home/home.component';
import { HomePageComponent } from './administrator-page/home-page/home-page.component';
import { RestaurantDashboardPageComponent } from "./client/dashboard/restaurant-dashboard-page.component";
import { ItemDetailPageComponent } from './client/item-detail/item-detail-page.component';
import { ItemSearchPageComponent } from './client/search/item-search-page.component';
import { ItemOrderPageComponent } from './client/order/item-order-page.component';
import { QrCodeGeneratorComponent } from './administrator-page/elements/qr-code-generator/qr-code-generato.component';
import { PaiementComponent } from './elements/paiement/paiement.component';
import { OrderPaymentPageComponent } from './client/payment/order-payment-page.component';
import { SettingsPageComponent } from './administrator-page/settings-page/settings-page.component';
import { AuthGuard } from './guards';
import { OrdersViewPageComponent } from './client/orders-view-page/orders-view-page.component';
import { AboutPageComponent } from './pages/about/about-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'paiement',
    component: PaiementComponent
  },
  {
    path: 'manage-items', component: CreateOrUpdateItemPageComponent, children: [
      {path: '', redirectTo: 'items', pathMatch: 'full' },
      {path: 'items', component: ItemStepComponent},
      {path: 'sections', component: SectionStepComponent},
      {path: 'summary', component: SummaryStepComponent},
      {path: 'done', component: DoneComponent},
    ]
  },
  {
    path: 'customer', children: [
      {path: '', redirectTo: 'restaurant', pathMatch: 'full' },
      { path: 'restaurant', component: RestaurantDashboardPageComponent },
      { path: 'item-detail', component: ItemDetailPageComponent },
      { path: 'item-search', component: ItemSearchPageComponent },
      { path: 'item-order', component: ItemOrderPageComponent },
      { path: 'item-payment', component: OrderPaymentPageComponent },
      { path: 'orders-view', component: OrdersViewPageComponent },
    ]
  },
  {
    path: 'account', component: AccountPageComponent, children: [
      {path: '', redirectTo: 'login', pathMatch: 'full' },
      {path: 'login', component: LoginContainerComponent},
      {path: 'create', component: CreateAccountContainerComponent},
    ]
  },
  {
    path: 'administration',
    component: AdministratorPageComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: HomePageComponent},
      {
        path: 'dashboard',
        component: HomePageComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'manage-items',
            component: CreateOrUpdateItemPageComponent,
            canActivate: [AuthGuard],
            children: [
              {path: 'items', component: ItemStepComponent},
              {path: 'sections', component: SectionStepComponent},
              {path: 'summary', component: SummaryStepComponent},
              {path: 'done', component: DoneComponent},
            ]
          }
        ]
      },
      {
        path: 'item',
        component: ItemPageComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'manage-items',
            component: CreateOrUpdateItemPageComponent,
            canActivate: [AuthGuard],
            children: [
              {path: 'items', component: ItemStepComponent},
              {path: 'sections', component: SectionStepComponent},
              {path: 'summary', component: SummaryStepComponent},
              {path: 'done', component: DoneComponent},
            ]
          }
        ]
      },
      {
        path: 'qr_code',
        component: QrCodeGeneratorComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'setting',
        component: SettingsPageComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: 'about', component: AboutPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
