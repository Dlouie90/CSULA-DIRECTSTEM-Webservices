import {Component, Input, OnInit} from '@angular/core';
import {Webservice} from '../../projects-mod/shared/webservice.model';
import {WebserviceService} from '../../projects-mod/shared/webservice.service';
import {ActivatedRoute, Params} from '@angular/router';
@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit {
  @Input()
  webservice: Webservice;

  editMode: boolean;

  constructor(private service: WebserviceService,
              private route: ActivatedRoute){

    this.editMode = false;
  }

  ngOnInit(): void {
    this.route.params
        .switchMap((params: Params) => {
          return this.service.getWebservice(+params['id']);
        })
        .subscribe((ws: Webservice) => {
          return this.webservice = ws;
        });
  }

}
