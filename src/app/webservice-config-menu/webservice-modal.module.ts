import { NgModule } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { WebserviceService } from '../shared/services/webservice.service';
import { ReactiveFormsModule } from '@angular/forms';
import { WebserviceFormComponent } from './webservice-form/webservice-form.component';
import { WebserviceCardComponent } from './webservice-card/webservice-card.component';
import { WebserviceInputsWiringComponent } from './webservice-inputs-wiring/webservice-inputs-wiring.component';
import { WebserviceListComponent } from './webservice-list/webservice-list.component';
import { WebserviceRowComponent } from './webservice-row/webservice-row.component';
import { WebserviceConfigMenuComponent } from './webservice-config-menu.component';

@NgModule({
    declarations: [
        WebserviceConfigMenuComponent,
        WebserviceFormComponent,
        WebserviceCardComponent,
        WebserviceInputsWiringComponent,
        WebserviceListComponent,
        WebserviceRowComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
    ],
    exports: [
        WebserviceConfigMenuComponent,
    ],
    providers: [
        NgbActiveModal,
        WebserviceService,
    ],
    entryComponents: [],
})
export class WebserviceModalModule {}
