import { NgModule } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { WebserviceFormComponent } from './webservice-form/webservice-form.component';
import { WebserviceCardComponent } from './webservice-card/webservice-card.component';
import { WebserviceInputsWiringComponent } from './webservice-inputs-wiring/webservice-inputs-wiring.component';
import { WebserviceListComponent } from './webservice-list/webservice-list.component';
import { WebserviceRowComponent } from './webservice-row/webservice-row.component';
import { WebserviceConfigMenuComponent } from './webservice-config-menu.component';
import { NodeService } from '../shared/services/node.service';
import { CompositionFormComponent } from './composition-form/composition-form.component';
import { ShareModule } from '../share.module';
import { ConfigureCompositionComponent } from './configure-composition/configure-composition.component';
import { ConfigureCompositionRowComponent } from './configure-composition/configure-composition-row/configure-composition-row.component';

@NgModule({
    declarations: [
        WebserviceConfigMenuComponent,
        WebserviceFormComponent,
        WebserviceCardComponent,
        WebserviceInputsWiringComponent,
        WebserviceListComponent,
        WebserviceRowComponent,
        CompositionFormComponent,
        ConfigureCompositionComponent,
        ConfigureCompositionRowComponent
    ],
    imports: [
        ShareModule,
        BrowserModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
    ],
    exports: [
        WebserviceConfigMenuComponent,
    ],
    providers: [
        NgbActiveModal,
        NodeService,
    ],
    entryComponents: [],
})
export class WebserviceModalModule {}
