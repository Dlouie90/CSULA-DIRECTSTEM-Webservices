import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {MainNavComponent} from './main-nav/main-nav.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {CarouselComponent} from './home/carousel/carousel.component';
import {CommonModule} from '@angular/common';
import {ProjectModule} from './projects-mod/project.module';
import {ProfileModule} from './profile-mod/profile.module';
import {InstructionsModule} from './instructions-mod/instructions.module';
import {FooterComponent} from './footer/footer.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { LoremIpsumModalComponent } from './shared/lorem-ipsum-modal/lorem-ipsum-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    CarouselComponent,
    FooterComponent,
    DashboardComponent,
    LoremIpsumModalComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ProjectModule,
    ProfileModule,
    InstructionsModule,
    AppRoutingModule,
  ],

  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule {
}
