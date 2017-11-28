import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    users: string;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getUsers().subscribe(users => this.users = users);
        console.log(this.users);
    }
}
