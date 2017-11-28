import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
    @Input() name: string; // Added Input annotation
    counter = 20;

    constructor(private userService: UserService,
                private router: Router) {

    }

    ngOnInit() {
    }

    // Add user function that saves input
    addUser(firstName: HTMLInputElement, lastName: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement): void {
        // console.log(`Adding firstname: ${firstName.value}, lastname: ${lastName.value},
        // Email: ${email.value}, Password: ${password.value}`);
        const newUser = new User({
            id: this.counter,
            firstName: `${firstName.value}`,
            lastName: `${lastName.value}`,
            email: `${email.value}`,
            password: `${password.value}`
        });
        // console.log(newUser);
        this.router.navigate(['/demo']);
    }
}
