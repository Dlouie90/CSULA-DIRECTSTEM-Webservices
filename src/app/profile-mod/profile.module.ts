import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileDetailComponent} from './profile-detail/profile-detail.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ProfileRoutingModule
  ],

  declarations: [
    ProfileDetailComponent,
  ]
})
export class ProfileModule {

}
