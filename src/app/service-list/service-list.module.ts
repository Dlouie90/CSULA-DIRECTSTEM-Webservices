import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

import {ServiceListComponent} from './service-list.component';

@NgModule({
  declarations: [
    ServiceListComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  exports: [
    ServiceListComponent,
  ],
  providers: [],
})
export class ServiceListModule {}
