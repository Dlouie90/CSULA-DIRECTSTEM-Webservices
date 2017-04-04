import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileDetailComponent} from './profile-detail/profile-detail.component';
import {DefinitionViewComponent} from './definition-view/definition-view.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ProfileRoutingModule
  ],

  declarations: [
    ProfileDetailComponent,
    DefinitionViewComponent
  ]
})
export class ProfileModule {

}
