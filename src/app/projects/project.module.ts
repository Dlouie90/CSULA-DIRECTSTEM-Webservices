import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProjectRoutingModule} from './project-routing.module';
import {ProjectsComponent} from './projects.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectRoutingModule
  ],

  declarations: [
    ProjectsComponent
  ],
})
export class ProjectModule {
}
