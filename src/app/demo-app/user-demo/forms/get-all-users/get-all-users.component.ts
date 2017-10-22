import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { User } from '../../../../shared/models/user.model';

@Component({
    selector: 'app-get-all-users',
    templateUrl: './get-all-users.component.html',
})
export class GetAllUsersComponent {
    @Output() onGetAllUser = new EventEmitter<any>();


    constructor(private userService: UserService) {
    }

    getUsers(): void {
        this.userService.getUsers()
            .subscribe((result: User[]) => this.onGetAllUser.emit(result))
    }
}
