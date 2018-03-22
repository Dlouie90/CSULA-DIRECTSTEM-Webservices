import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userId: number;
  userE: User;

  constructor(private userService: UserService, private router: Router, private routerAct: ActivatedRoute) { }

  ngOnInit() {
      this.userE = { id: 0, firstName: '', lastName: '', email: '', password: '', description: ''};
    this.userId = this.routerAct.snapshot.params['id'];
    console.log('userId:', + this.userId)
    this.userService.getUserById(this.userId).subscribe(
        (userToEdit) => this.userE = userToEdit.user,
    )
  }

  onSave(firstName: HTMLInputElement, lastName: HTMLInputElement, email: HTMLInputElement, password: HTMLInputElement) {
      const editedUser = new User({
          id: this.userId,
          firstName: `${firstName.value}`,
          lastName: `${lastName.value}`,
          email: `${email.value}`,
          password: `${password.value}`,
      });

      this.userService.updateUserById(this.userId, editedUser).subscribe(
          () => console.log(editedUser),
          (error) => console.log(error),
      );
      this.router.navigate(['/admin']);
  }

  onCancel() {
      this.router.navigate(['/admin']);
  }

}
