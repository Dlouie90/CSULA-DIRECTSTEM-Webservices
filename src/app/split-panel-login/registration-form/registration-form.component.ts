import {Component,
        EventEmitter,
        Output} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import {CreateUserResponse} from '../../shared/models/server-response/create-user-response.model';
import {UserService} from '../../shared/services/user.service';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  @Output()
  onRegister = new EventEmitter<CreateUserResponse>();
  form: FormGroup;
  message: string;


  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.createForm();
  }

  private createForm(): void{
      this.form = this.formBuilder.group(
          {
            email: ['', Validators.compose([
                      Validators.required, Validators.email
                    ])],
            password: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
          },
          )}

  getValidationStyle(controlName: string): any {
    return {
      'is-valid': this.form.get(controlName).dirty && this.form.get(controlName).valid,
          'is-invalid': this.form.get(controlName).dirty && !this.form.get(controlName).valid,
    }
  }

  close(): void {
    this.message = '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.message = 'ERROR - FORM IS INVALID';
      return;
    }
    this.registerUser();
  }

  private registerUser(): void {
    const pendingUser = this.form.value;
    this.userService
        .createUser(pendingUser)
        .subscribe(
            (res: CreateUserResponse) => {
              if (res.successful) {
                this.message = 'USER REGISTERED';
                this.onRegister.emit(res);
              } else {
                this.message = 'ERROR - USER NOT REGISTERED';
              }
            },
            () => {
              this.message = `ERROR - SOMETHING WENT WRONG WITH THE REQUEST`;
            },
            () => {
              this.form.reset();
            })
  }
}
