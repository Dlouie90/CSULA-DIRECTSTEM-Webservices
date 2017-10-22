import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { User } from '../../../../shared/models/user.model';

@Component({
    selector: 'app-user-by-id-form',
    templateUrl: './user-by-id-form.component.html'
})
export class UserByIdFormComponent {
    @Output() onGetUser = new EventEmitter<any>();


    constructor(private userService: UserService) { }

    getUserById(id: string): void {
        const idNumber = parseInt(id, 10);
        this.userService.getUserById(idNumber)
            .subscribe((user: User) => {
                console.log('user:', user);
                this.onGetUser.emit(user);
            });
    }
}
