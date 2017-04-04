import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {MainNavComponent} from './main-nav/main-nav.component';
import {AppRoutingModule} from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { CarouselComponent } from './home/carousel/carousel.component';
import {CommonModule} from '@angular/common';
import {ProjectModule} from './projects/project.module';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    InstructionsComponent,
    CarouselComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    ProjectModule,
    AppRoutingModule,
  ],

  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule {
}
