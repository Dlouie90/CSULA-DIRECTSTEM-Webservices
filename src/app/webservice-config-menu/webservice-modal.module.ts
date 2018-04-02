import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbActiveModal,
        NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ShareModule} from '../share.module';

import {CompositionFormComponent} from './composition-form/composition-form.component';
import {WebServiceBuilderComponent} from './webservicebuilder-form/webservicebuilder-form.component';
import {WebServiceResponseComponent} from './webserviceresponse-form/webserviceresponse-form.component';
import {ConfigureCompositionRowComponent} from './configure-composition/configure-composition-row/configure-composition-row.component';
import {ConfigureCompositionComponent} from './configure-composition/configure-composition.component';
import {WebserviceCardComponent} from './webservice-card/webservice-card.component';
import {WebserviceConfigMenuComponent} from './webservice-config-menu.component';
import {WebserviceFormComponent} from './webservice-form/webservice-form.component';
import {WebserviceInputsWiringComponent} from './webservice-inputs-wiring/webservice-inputs-wiring.component';
import {WebserviceListComponent} from './webservice-list/webservice-list.component';
import {WebserviceRowComponent} from './webservice-row/webservice-row.component';

@NgModule({
  declarations: [
    WebserviceConfigMenuComponent,
    WebserviceFormComponent,
    WebserviceCardComponent,
    WebserviceInputsWiringComponent,
    WebserviceListComponent,
    WebserviceRowComponent,
    CompositionFormComponent,
    WebServiceBuilderComponent,
    WebServiceResponseComponent,
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
    CompositionFormComponent,
    WebServiceBuilderComponent,
    WebserviceConfigMenuComponent,
  ],
  providers: [
    NgbActiveModal,
  ],
  entryComponents: [],
})
export class WebserviceModalModule {}
