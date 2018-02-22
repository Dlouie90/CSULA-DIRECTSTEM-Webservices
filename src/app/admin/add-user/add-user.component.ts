import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreateUserResponse} from '../../shared/models/server-response/create-user-response.model';
import {UserService} from '../../shared/services/user.service';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
    @Output()
    onAdd = new EventEmitter<any>();
    newAddUserForm: FormGroup;

    constructor(private userService: UserService, private formBuilder: FormBuilder) {
        this.newAddUserForm = formBuilder.group({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            description: '',
        });
    }

    createUser(): void {
        this.userService.createUser(this.newAddUserForm.value)
            .subscribe(
                (res: CreateUserResponse) => this.onAdd.emit(res),
                (err: any) => this.onAdd.emit(err),
                () => this.newAddUserForm.reset());
    }
}
