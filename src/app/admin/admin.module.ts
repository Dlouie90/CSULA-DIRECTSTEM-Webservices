import {NgModule} from '@angular/core';
import {AddUserComponent} from './add-user/add-user.component';
import {HttpModule} from '@angular/http';
import {AdminComponent} from './admin.component';

@NgModule({
    declarations: [
        AdminComponent,
        AddUserComponent
    ],
    imports: [
        HttpModule
    ],
    exports: [AdminComponent]
})
export class AdminModule {
}