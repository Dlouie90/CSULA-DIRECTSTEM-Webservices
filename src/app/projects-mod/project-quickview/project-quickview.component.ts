import {Component, Input, OnInit} from '@angular/core';
import {Webservice} from '../../shared/webservice.model';
import {WebserviceService} from '../../shared/webservice.service';
import {ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector   : 'app-project-detail',
  templateUrl: './project-quickview.component.html',
  styleUrls  : ['./project-quickview.component.css']
})
export class ProjectQuickViewComponent implements OnInit {
  @Input()
  webservice: Webservice;

  editMode: boolean;

  constructor(private service: WebserviceService,
              private route: ActivatedRoute) {

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
