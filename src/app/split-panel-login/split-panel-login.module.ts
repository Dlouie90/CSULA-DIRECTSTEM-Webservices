import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {UserService} from '../shared/services/user.service';

import {LoginFormComponent} from './login-form/login-form.component';
import {RegistrationFormComponent} from './registration-form/registration-form.component';
import {SplitPanelLoginComponent} from './split-panel-login.component';

@NgModule({
  declarations: [
    SplitPanelLoginComponent,
    RegistrationFormComponent,
    LoginFormComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
  ],
  exports: [
    SplitPanelLoginComponent,
  ],
  providers: [
    UserService
  ],
  entryComponents: [
    SplitPanelLoginComponent
  ]
})
export class SplitPanelLoginModule {}
