import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { GetUserByIdResponse } from '../../../../shared/models/server-response/get-user-by-id-response';

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
            .subscribe((res: GetUserByIdResponse) => {
                if (res.success) {
                    const user = res.user;
                    console.log('user:', user);
                    this.onGetUser.emit(user);
                } else {
                    console.log(`Get user by id ${ id } failed.`);
                }
            });
    }
}
