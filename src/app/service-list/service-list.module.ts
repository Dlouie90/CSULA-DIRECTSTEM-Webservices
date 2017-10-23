import { NgModule } from '@angular/core';
import { ServiceListComponent } from './service-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

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
