import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DemoAppComponent } from './demo-app.component';
import { DemoAppRoutingModule } from './demo-app-routing.module';
import { HttpModule } from '@angular/http';
import { DemoService } from './demo.service';
import { WebserviceModalModule } from '../webservice-config-menu/webservice-modal.module';
import { WebserviceConfigMenuComponent } from '../webservice-config-menu/webservice-config-menu.component';
import { UserService } from '../shared/services/user.service';
import { UserDemoComponent } from './user-demo/user-demo.component';
import { UserDemoModule } from './user-demo/user-demo.module';

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
