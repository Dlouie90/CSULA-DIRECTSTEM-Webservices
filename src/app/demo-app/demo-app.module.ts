import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DemoAppComponent } from './demo-app.component';
import { DemoAppRoutingModule } from './demo-app-routing.module';
import { HttpModule } from '@angular/http';
import { WebserviceService } from './webservice.service';

@NgModule({
    declarations: [
        DemoAppComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        DemoAppRoutingModule,
    ],
    exports: [],
    providers: [
        WebserviceService,
    ]
})
export class DemoAppModule {
}
