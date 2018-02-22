import {Component, OnInit} from '@angular/core';
import {FormBuilder,
    FormGroup} from '@angular/forms';
// import {UserService} from '../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent {
 //   users: string;

    // constructor(private userService: UserService) {
    // }
    //
    // ngOnInit() {
    //     this.userService.getUsers().subscribe(users => this.users = users);
    //     console.log(this.users);
    // }
    requestResult: any = {};
    addUserForm: FormGroup;
    index = 1;

    constructor(private formBuilder: FormBuilder, private router: Router) {
        this.addUserForm = formBuilder.group({
            firstName: [''],
            lastName: [''],
            username: [''],
            email: [''],
            password: ['']
        });

        // this.updateUserForm = formBuilder.group({
        //     id: [''],
        //     firstName: [''],
        //     lastName: ['']
        // });
    }

    onResult(result): void {
        this.requestResult = result;
    }

    addUser(): void {
        this.router.navigate(['/admin/add-user']);
    }
}
