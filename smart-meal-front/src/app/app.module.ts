import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from './guards';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RestApiProvider} from "../infra/rest/RestApiProvider";
import {Items} from "../domain/external/Items";
import {Restaurants} from "../domain/external/Restaurants";
import {Orders} from "../domain/external/Orders";
import {RestaurantsData} from "../infra/rest/RestaurantsData";
import {OrdersData} from "../infra/rest/OrdersData";
import { InputComponent } from './elements/input/input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import { ButtonComponent } from './elements/button/button.component';
import {MatOption, MatSelect} from "@angular/material/select";
import {CreateOrUpdateItemPageComponent} from "./create-or-update-item-page/create-or-update-item-page.component";
import {LogoComponent} from "./elements/logo/logo.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import {ProgressBarComponent} from "./elements/progress-bar/progress-bar.component";
import {StepDetailsComponent} from "./create-or-update-item-page/step-details/step-details.component";
import {ItemFormComponent} from "./elements/forms/item-form/item-form.component";
import {MatIcon} from "@angular/material/icon";
import {MatChipGrid, MatChipInput, MatChipRow} from "@angular/material/chips";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormSectionComponent} from "./elements/forms/form-section/form-section.component";
import {CardComponent} from "./elements/card/card.component";
import {GoogleIconComponent} from "./elements/google-icon/google-icon.component";
import {AddButtonComponent} from "./elements/add-button/add-button.component";
import {ItemStepComponent} from "./create-or-update-item-page/step/item-step/item-step.component";
import {SectionStepComponent} from "./create-or-update-item-page/step/section-step/section-step.component";
import {ModalComponent} from "./create-or-update-item-page/step/modal/modal.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {DoneComponent} from "./create-or-update-item-page/done/done.component";
import {LinkComponent} from "./elements/link/link.component";
import {ErrorComponent} from "./error/error.component";
import {NavigationComponent} from "./administrator-page/elements/navigation/navigation.component";
import {AdministratorPageComponent} from "./administrator-page/administrator-page.component";
import {BodyComponent} from "./administrator-page/elements/body/body.component";
import {HeaderComponent} from "./administrator-page/elements/header/header.component";
import {ItemsContainerComponent} from "./administrator-page/elements/items-container/items-container.component";
import {HomePageComponent} from "./administrator-page/home-page/home-page.component";
import {CarouselModule} from "ngx-owl-carousel-o";
import {OrderContainerComponent} from "./administrator-page/elements/order-container/order-container.component";
import {RevenueContainerComponent} from "./administrator-page/elements/revenue-container/revenue-container.component";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {ItemsData} from "../infra/rest/ItemsData";
import {AccountPageComponent} from "./account-page/account-page.component";
import {
  CreateAccountContainerComponent
} from "./account-page/create-account-container/create-account-container.component";
import {LoginContainerComponent} from "./account-page/login-container/login-container.component";
import {UploaderComponent} from "./elements/uploader/uploader.component";
import {ItemPageComponent} from "./administrator-page/item-page/item-page.component";
import {SpinnerComponent} from "./elements/spinner/spinner.component";
import {
  SectionsContainerComponent
} from "./administrator-page/elements/sections-container/sections-container.component";
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CardRestaurantComponent } from './home/card-restaurant/card-restaurant.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { RestaurantDashboardPageComponent } from './client/dashboard/restaurant-dashboard-page.component';
import { SectionComponent } from './client/elements/section/section.component';
import { ItemComponent } from './client/elements/item/item.component';
import { OrderItemComponent } from './client/elements/order-item/order-item.component';
import { SearchComponent } from './client/elements/search/search.component';
import { ItemDetailPageComponent } from './client/item-detail/item-detail-page.component';
import { ItemSearchPageComponent } from './client/search/item-search-page.component';
import { ItemOrderPageComponent } from './client/order/item-order-page.component';
import { ItemFilterPopup } from './client/elements/popup/filter-popup.component';
import { ItemCriteriaFormComponent } from './client/elements/form/item-criteria-form/item-criteria-form.component';
import { RestaurantSearchComponent } from './client/elements/restaurant-search/restaurant-search.component';
import { BaseChartDirective } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QrCodeGeneratorComponent } from './administrator-page/elements/qr-code-generator/qr-code-generato.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PaiementComponent } from './elements/paiement/paiement.component';
import { TableNumberPopup } from './client/elements/popup/table-number-popup.component';
import { OrderPaymentPageComponent } from './client/payment/order-payment-page.component';
import { OrderDetailsComponent } from './administrator-page/elements/order-container/order-details/order-details.component';
import { ConfirmationModalComponent } from './shared/confirmation-modal/confirmation-modal.component';
import { SettingsPageComponent } from './administrator-page/settings-page/settings-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrdersViewPageComponent } from './client/orders-view-page/orders-view-page.component';
import { OrderedItemComponent } from './client/elements/ordered-item/ordered-item.component';
import { UserInfoComponent } from './client/elements/user-info/user-info.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';
import { AboutPageComponent } from './pages/about/about-page.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { BottomNavComponent } from './client/elements/bottom-nav/bottom-nav.component';
import { OrderedItemDetailsComponent } from './client/elements/ordered-item/ordered-item-details/ordered-item-details.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    ButtonComponent,
    CreateOrUpdateItemPageComponent,
    ItemFormComponent,
    FormSectionComponent,
    CardComponent,
    GoogleIconComponent,
    AddButtonComponent,
    ItemStepComponent,
    SectionStepComponent,
    ModalComponent,
    ErrorComponent,
    DoneComponent,
    NavigationComponent,
    AdministratorPageComponent,
    BodyComponent,
    HeaderComponent,
    ItemsContainerComponent,
    HomePageComponent,
    OrderContainerComponent,
    RevenueContainerComponent,
    AccountPageComponent,
    CreateAccountContainerComponent,
    LoginContainerComponent,
    SpinnerComponent,
    ItemPageComponent,
    SectionsContainerComponent,
    HomeComponent,
    NavbarComponent,
    CardRestaurantComponent,
    QrCodeGeneratorComponent,
    FooterComponent,
    RestaurantDashboardPageComponent,
    ItemDetailPageComponent,
    ItemSearchPageComponent,
    ItemOrderPageComponent,
    SectionComponent,
    ItemComponent,
    OrderItemComponent,
    SearchComponent,
    ItemFilterPopup,
    ItemCriteriaFormComponent,
    RestaurantSearchComponent,
    PaiementComponent,
    TableNumberPopup,
    OrderPaymentPageComponent,
    OrderDetailsComponent,
    ConfirmationModalComponent,
    SettingsPageComponent,
    OrdersViewPageComponent,
    OrderedItemComponent,
    UserInfoComponent,
    CookieConsentComponent,
    AboutPageComponent,
    LoadingComponent,
    ErrorPageComponent,
    UploaderComponent,
    BottomNavComponent,
    OrderedItemDetailsComponent
  ],
  imports: [
    BrowserModule,
    BaseChartDirective,
    NgxChartsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelect,
    MatOption,
    QRCodeModule,
    LogoComponent,
    MatProgressBar,
    ProgressBarComponent,
    StepDetailsComponent,
    MatIcon,
    MatChipRow,
    MatChipGrid,
    MatChipInput,
    MatAutocomplete,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    FormsModule,
    MatSlideToggle,
    LinkComponent,
    CarouselModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ImageCropperComponent,
    NgxChartsModule,
  ],
  providers: [
    {provide: Items, useClass: ItemsData},
    {provide: Restaurants, useClass: RestaurantsData},
    {provide: Orders, useClass: OrdersData},
    {provide: RestApiProvider, useClass: RestApiProvider},
    AuthGuard
  ],
  exports: [
    InputComponent,
    ButtonComponent,
    FormSectionComponent,
    GoogleIconComponent,
    ItemsContainerComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

