import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/map';
import {User} from '../shared/models/user.model'
// import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    users: User[];
    closeResult: string;

    constructor(private userService: UserService,
                private router: Router,
                private routerAct: ActivatedRoute) {
    }

    ngOnInit() {
        this.userService.getUsers().subscribe(
            (users) => {
                this.users = users.users;
            }
        );
    }

    // getUsers() {
    //     this.userService.getUsers()
    //         .subscribe(
    //             (users: User[]) => this.users = users,
    //             () => {
    //                 this.users = [];
    //                 console.log('failed to load users, defaulting to empty :', []);
    //             }
    //         );
    // }

    onBackToAdmin() {
        this.router.navigate(['/admin']);
        // this.userService.getUsers().subscribe(
        //     (users) => {
        //         this.users = users.users;
        //     }
        // );
    }

    onAdd() {
        this.router.navigate(['/add']);
    }

    onEdit(id) {
        this.router.navigate(['/edit/' + id]);
    }

    onUserSess() {
        this.router.navigate(['admin/user-session']);
    }

    onDeleteUser(id: number) {
        this.userService.deleteUserById(id).subscribe(
            (u) => {
            //     // find the index of u inside this.users (if there is any)
                const index = this.users.findIndex((user: User) => user.id === u.id);
            //     // if the index is 0 or greater, that means u exists in this.users
            //     // and we need to remove u from this.users by splicing
                if (index >= 0) {
                    this.users.splice(index, 1);
                }
            },
        (error) => console.log(error),
            // () =>  console.log('complete'),
        );
    }

    onDetail() {
        this.router.navigate(['/detail']);
    }

    // open(content, userId) {
    //     this.modalService.open(content).result.then((result) => {
    //         this.closeResult = `Closed with: ${result}`;
    //         this.onDeleteUser(userId);
    //         this.router.navigate(['/admin']);
    //     }, (reason) => {
    //         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //     });
    // }
    //
    // private getDismissReason(reason: any): string {
    //     if (reason === ModalDismissReasons.ESC) {
    //         return 'by pressing ESC';
    //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //         return 'by clicking on a backdrop';
    //     } else {
    //         return  `with: ${reason}`;
    //     }
    // }
}
