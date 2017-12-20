import {Component,
        EventEmitter,
        Output} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {LoginUserResponse} from '../../shared/models/server-response/login-user-response';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  @Output()
  onLogin = new EventEmitter<LoginUserResponse>();
  form: FormGroup;
  message: string;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.createForm();
  }

  private createForm(): void{
      this.form = this.formBuilder.group({
        email: ['', Validators.compose([
                  Validators.required, Validators.email
                ])],
        password: ['', Validators.required],
      })}

  deleteMessage(): void {
    this.message = '';
  }

  getValidationStyle(controlName: string): any {
    return {
      'is-valid': this.form.get(controlName).dirty && this.form.get(controlName).valid,
          'is-invalid': this.form.get(controlName).dirty && !this.form.get(controlName).valid,
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log('invalid form');
      this.message = 'ERROR - FORM IS INVALID';
      return;
    }

    this.login();
  }

  private login(): void {
    const info = this.form.value;
    this.userService
        .loginUser(info)
        .subscribe(
            (res: LoginUserResponse) => {
              if (res.successful) {
                this.message = 'LOGIN SUCCESSFUL';
                this.onLogin.emit(res);
              } else {
                this.message = 'LOGIN UNSUCCESSFUL'
              }
            },
            () => {
              this.message = 'ERROR - SOMETHING WENT WRONG WITH THE REQUEST';
            },
            () => {
              this.form.reset();
            });
  }
}
