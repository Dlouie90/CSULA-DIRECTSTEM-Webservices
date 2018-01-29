import {Component,
        EventEmitter,
        Output} from '@angular/core';
import {FormBuilder,
        FormGroup} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
})
export class UpdateUserFormComponent {
  @Output()
  onUpdate = new EventEmitter<any>();
  updateForm: FormGroup;


  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.updateForm = formBuilder.group({
      id: '',
      firstName: '',
      lastName: '',
      description: ''
    });
  }

  updateUser(): void {
    const user = this.updateForm.value;
    const id = user.id;
    this.userService
        .updateUserById(id, user)
        .subscribe((result: any) => {
          this.updateForm.reset();
          this.onUpdate.emit(result)
        });
  }
}
