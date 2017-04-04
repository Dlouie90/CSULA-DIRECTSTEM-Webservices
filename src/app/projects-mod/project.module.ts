import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProjectRoutingModule} from './project-routing.module';
import {ProjectsComponent} from './projects.component';
import {WebserviceService} from './shared/webservice.service';
import {ProjectsMenuComponent} from './projects-menu/projects-menu.component';
import {ProjectFormComponent} from './project-form/project-form.component';
import {ProjectQuickViewComponent} from './project-quickview/project-quickview.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectRoutingModule
  ],

  declarations: [
    ProjectsComponent,
    ProjectsMenuComponent,
    ProjectQuickViewComponent,
    ProjectFormComponent,
  ],

  providers: [
    WebserviceService
  ]
})
export class ProjectModule {
}
