import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ClickOutsideDirective } from './click-outside.directive';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCardModule } from '@angular/material/card';
import { AngularMaterialModule } from './angular-material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgImageSliderModule } from 'ng-image-slider';
import { QRCodeModule } from 'angularx-qrcode';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AngularFireModule } from "@angular/fire";
import { CarouselModule } from 'ngx-owl-carousel-o';

import { AppComponent } from './app.component';
import { HeaderComponent } from './menu/header/header.component';
import { CreateInfoComponent } from './infomations/create-info/create-info.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { TicketsCityComponent } from './tickets/tickets-city/tickets-city.component';
import { TicketDetailComponent } from './tickets/ticket-detail/ticket-detail.component';
import { TicketDetailUpdateComponent } from './tickets/ticket-detail-update/ticket-detail-update.component';
import { PayComponent } from './pages/pay/pay.component';
import { OrderComponent } from './pages/order/order.component';
import { DetailInfoComponent } from './pages/detail-info/detail-info.component';
import { FooterComponent } from './menu/footer/footer.component';
import { PageSearchComponent } from './pages/page-search/page-search.component';
import { TicketsCategoryComponent } from './tickets/tickets-category/tickets-category.component';
import { CommentComponent } from './tickets/comment/comment.component';
import { RatedComponent } from './tickets/rated/rated.component';
import { RatingComponent } from './atom/rating/rating.component';
import { TicketComponent } from './atom/ticket/ticket.component';
import { LogoIconComponent } from './atom/logo-icon.component';
import { CityComponent } from './atom/city/city.component';
import { TicketSlideComponent } from './molecule/ticket-slide/ticket-slide.component';
import { CitySlideComponent } from './molecule/city-slide/city-slide.component';
import { CartItemComponent } from './atom/cart-item/cart-item.component';
import { AvatarAccountComponent } from './atom/avatar-account.component';
import { MainComponent } from './menu/main/main.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TicketsCityComponent,
    CreateInfoComponent,
    HomeComponent,
    CartComponent,
    TicketDetailComponent,
    TicketDetailUpdateComponent,
    PayComponent,
    OrderComponent,
    DetailInfoComponent,
    FooterComponent,
    PageSearchComponent,
    TicketsCategoryComponent,
    CommentComponent,
    RatedComponent,
    ClickOutsideDirective,
    RatingComponent,
    TicketComponent,
    TicketSlideComponent,
    CitySlideComponent,
    CityComponent,
    LogoIconComponent,
    CartItemComponent,
    AvatarAccountComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxMatSelectSearchModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    MatCardModule,
    AuthModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgImageSliderModule,
    QRCodeModule,
    CarouselModule,
    [SweetAlert2Module.forRoot()],
    AngularFireModule.initializeApp(environment.firebaseConfig, "cloud")
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
