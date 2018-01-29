import {Component,
        EventEmitter,
        Output} from '@angular/core';
import {FormBuilder,
        FormGroup} from '@angular/forms';

import {CreateUserResponse} from '../../../../shared/models/server-response/create-user-response.model';
import {UserService} from '../../../../shared/services/user.service';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-forms.component.html',
})
export class CreateUserFormComponent {
  @Output()
  onCreate = new EventEmitter<any>();
  newUserForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.newUserForm = formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      description: '',
    });
  }

  createUser(): void {
    this.userService.createUser(this.newUserForm.value)
        .subscribe(
            (res: CreateUserResponse) => this.onCreate.emit(res),
            (err: any) => this.onCreate.emit(err),
            () => this.newUserForm.reset());
  }
}
