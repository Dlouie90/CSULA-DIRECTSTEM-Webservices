import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
    @Input() name: string; // Added Input annotation
    counter = 20;
    @ViewChild('f') signupForm: NgForm;

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
            id: this.counter++,
            firstName: `${firstName.value}`,
            lastName: `${lastName.value}`,
            email: `${email.value}`,
            password: `${password.value}`,
        });
        this.userService.createUser(newUser).subscribe(
            (res) => console.log(res)
        );
        this.router.navigate(['/admin']);
    }
    onCancel() {
        this.router.navigate(['/admin']);
    }

    onSubmit() {
        if (this.signupForm.valid && (this.signupForm.value.password === this.signupForm.value.cPassword)) {
            const newUser = new User(
                {
                    id: this.counter++,
                    firstName: this.signupForm.value.firstName,
                    lastName: this.signupForm.value.lastName,
                    email: this.signupForm.value.email,
                    password: this.signupForm.value.password
                }
            )
            this.userService.createUser(newUser).subscribe(
                (us) => console.log(us)
            )
            this.router.navigate(['/admin']);
        }
    }
}
