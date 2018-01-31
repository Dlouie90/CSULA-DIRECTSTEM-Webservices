import {Component,
        EventEmitter,
        Output} from '@angular/core';

import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';

@Component({
  selector: 'app-get-all-users',
  templateUrl: './get-all-users.component.html',
})
export class GetAllUsersComponent {
  @Output()
  onGetAllUser = new EventEmitter<any>();


  constructor(private userService: UserService) {
  }

  getUsers(): void {
    this.userService.getUsers()
        .subscribe((result: User[]) => this.onGetAllUser.emit(result))
  }
}
