import {Component, OnInit} from '@angular/core';
import {WebserviceService} from '../shared/webservice.service';
import {Webservice} from '../shared/webservice.model';

@Component({
  selector   : 'app-projects-menu',
  templateUrl: './projects-menu.component.html',
  styleUrls  : ['./projects-menu.component.css']
})
export class ProjectsMenuComponent implements OnInit {

  constructor(private service: WebserviceService) {
  }

  ngOnInit() {
  }

  get webservices(): Webservice[] {
    return this.service.webservices;
  }
}
