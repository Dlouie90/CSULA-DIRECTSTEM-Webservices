import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {UserService} from '../../shared/services/user.service';

import {CreateUserFormComponent} from './forms/create-user-form/create-user-forms.component';
import {DeleteUserFormComponent} from './forms/delete-user-form/delete-user-form.component';
import {GetAllUsersComponent} from './forms/get-all-users/get-all-users.component';
import {LoginFormComponent} from './forms/login-form/login.component';
import {UpdateUserFormComponent} from './forms/update-user-form/update-user-form.component';
import {UserByIdFormComponent} from './forms/user-by-id-form/user-by-id-form.component';
import {UserDemoComponent} from './user-demo.component';

@NgModule({
  declarations: [
    UserDemoComponent,
    CreateUserFormComponent,
    LoginFormComponent,
    GetAllUsersComponent,
    DeleteUserFormComponent,
    UpdateUserFormComponent,
    UserByIdFormComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
  ],
  exports: [
    UserDemoComponent,
  ],
  providers: [
    UserService
  ],
})
export class UserDemoModule {}
