import {NgModule} from '@angular/core';
import {AddUserComponent} from './add-user/add-user.component';
import {HttpModule} from '@angular/http';
import {AdminComponent} from './admin.component';
import {CommonModule} from '@angular/common';
import {UserService} from '../shared/services/user.service';
import {NgbModule} from'@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        AdminComponent,
        AddUserComponent
    ],
    imports: [
        HttpModule,
        NgbModule,
        CommonModule,
        BrowserModule,
        ReactiveFormsModule
    ],
    exports: [
        AdminComponent,
        AddUserComponent
    ],
    providers: [
        UserService
    ],
})
export class AdminModule {
}
