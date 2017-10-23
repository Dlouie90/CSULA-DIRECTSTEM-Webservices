import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserResponse } from '../shared/models/server-response/create-user-response.model';

@Component({
    selector: 'app-split-panel-login',
    templateUrl: './split-panel-login.component.html',
    styleUrls: ['./split-panel-login.component.css']
})
export class SplitPanelLoginComponent {

    constructor(private activeModal: NgbActiveModal) { }

    onRegister(res: CreateUserResponse): void {
        console.log('onRegister', res);
        this.activeModal.close();
    }

    onLogin(res: CreateUserResponse): void {
        console.log('onLogin', res);
        this.activeModal.close();
    }
}
