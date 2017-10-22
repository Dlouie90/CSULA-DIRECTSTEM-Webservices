import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-user-demo',
    templateUrl: './user-demo.component.html'
})
export class UserDemoComponent {
    requestResult: any = {};
    createUserForm: FormGroup;
    updateUserForm: FormGroup;
    index = 1;

    constructor(private formBuilder: FormBuilder) {
        this.createUserForm = formBuilder.group({
            firstName: [''],
            lastName: [''],
            username: [''],
            email: [''],
            password: ['']
        });

        this.updateUserForm = formBuilder.group({
            id: [''],
            firstName: [''],
            lastName: ['']
        });
    }

    onResult(result): void {
        this.requestResult = result;
    }
}
