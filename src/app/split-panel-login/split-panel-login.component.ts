import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserResponse } from '../shared/models/server-response/create-user-response.model';
import { UserService } from '../shared/services/user.service';

@Component({
    selector: 'app-split-panel-login',
    templateUrl: './split-panel-login.component.html',
    styleUrls: ['./split-panel-login.component.css']
})
export class SplitPanelLoginComponent {

    constructor(private activeModal: NgbActiveModal,
                private userService: UserService) { }

    onRegister(res: CreateUserResponse): void {
        console.log('onRegister', res);
        this.activeModal.close();
    }

    onLogin(res: CreateUserResponse): void {
        console.log('onLogin', res);
        this.userService.setCurrentUser(res.user);
        this.activeModal.close();
    }
}
