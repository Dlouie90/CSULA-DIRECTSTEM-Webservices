import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DemoAppComponent } from './demo-app.component';
import { DemoAppRoutingModule } from './demo-app-routing.module';
import { HttpModule } from '@angular/http';
import { DemoService } from './demo.service';
import { WebserviceModalModule } from '../webservice-config-menu/webservice-modal.module';
import { WebserviceConfigMenuComponent } from '../webservice-config-menu/webservice-config-menu.component';

@NgModule({
    declarations: [
        DemoAppComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        WebserviceModalModule,
        DemoAppRoutingModule,
    ],
    exports: [],
    providers: [
        DemoService,
    ],
    entryComponents: [
        WebserviceConfigMenuComponent
    ]
})
export class DemoAppModule {}
