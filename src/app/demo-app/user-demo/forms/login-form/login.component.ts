import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
    loginForm: FormGroup;
    @Output() onLogin = new EventEmitter<any>();


    constructor(private userService: UserService,
                private formBuilder: FormBuilder) {

        this.loginForm = formBuilder.group({
            email: '',
            password: '',
        });
    }

    login(): void {
        const info = this.loginForm.value;
        this.loginForm.reset();
        this.userService
            .loginUser(info)
            .subscribe((result: any) => this.onLogin.emit(result));
    }

}
