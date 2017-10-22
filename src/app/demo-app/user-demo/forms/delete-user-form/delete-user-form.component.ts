import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';

@Component({
    selector: 'app-delete-user-form',
    templateUrl: './delete-user-form.component.html',
})
export class DeleteUserFormComponent {
    @Output() onDeleteUser = new EventEmitter<any>();


    constructor(private userService: UserService) {
    }

    deleteUser(id: string): void {
        const numberId = parseInt(id, 10);
        this.userService.deleteUserById(numberId)
            .subscribe((result: any) => this.onDeleteUser.emit(result));
    }

}
