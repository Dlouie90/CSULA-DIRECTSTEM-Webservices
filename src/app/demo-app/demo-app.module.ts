import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DemoAppComponent } from './demo-app.component';
import { DemoAppRoutingModule } from './demo-app-routing.module';
import { HttpModule } from '@angular/http';
import { WebserviceModalModule } from '../webservice-config-menu/webservice-modal.module';
import { WebserviceConfigMenuComponent } from '../webservice-config-menu/webservice-config-menu.component';
import { UserDemoModule } from './user-demo/user-demo.module';
import { SplitPanelLoginModule } from '../split-panel-login/split-panel-login.module';
import { ServiceListModule } from '../service-list/service-list.module';

@NgModule({
    declarations: [
        DemoAppComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        WebserviceModalModule,
        DemoAppRoutingModule,
        UserDemoModule,
        SplitPanelLoginModule,
        ServiceListModule,
    ],
    exports: [],
    providers: [],
    entryComponents: [
        WebserviceConfigMenuComponent
    ]
})
export class DemoAppModule {}
