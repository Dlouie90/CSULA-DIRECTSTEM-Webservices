import {NgModule} from '@angular/core';
import {AddUserComponent} from './add-user/add-user.component';
import {HttpModule} from '@angular/http';
import {AdminComponent} from './admin.component';
import {CommonModule} from '@angular/common';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserSessionComponent } from './user-session/user-session.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';


@NgModule({
    declarations: [
        AdminComponent,
        AddUserComponent,
        EditUserComponent,
        UserSessionComponent,
        DetailUserComponent
    ],
    imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
        CommonModule
    ],
    exports: [
        AdminComponent,
        AddUserComponent
    ],
})
export class AdminModule {
}
