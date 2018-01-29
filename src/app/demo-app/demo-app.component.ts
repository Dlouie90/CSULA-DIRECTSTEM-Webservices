import 'rxjs/add/operator/toPromise';

import {Component,
        OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {Node} from '../shared/models/node.model';
import {SplitPanelLoginComponent} from '../split-panel-login/split-panel-login.component';
import {WebserviceConfigMenuComponent} from '../webservice-config-menu/webservice-config-menu.component';

interface DemoQueryParam {
  name: string,
      queryParams: {index: number}
}

@Component({
  selector: 'app-demo-app',
  templateUrl: './demo-app.component.html',
  styleUrls: ['./demo-app.component.css']
})
export class DemoAppComponent implements OnInit {
  demoNode = new Node(-1, -1, -1);

  paths: DemoQueryParam[];
  index = 1;

  constructor(private route: ActivatedRoute, private modalService: NgbModal) {
    this.route.queryParams
        .subscribe(params => this.index = params['index']);

    this.initPaths();
  }

  ngOnInit() {}

  initPaths(): void {
    this.paths = [
      {name: 'Composition', queryParams: {index: 1}},
      {name: 'Service Menu', queryParams: {index: 2}},
      {name: 'User Database', queryParams: {index: 3}},
      {name: 'Login Registration', queryParams: {index: 4}}
    ];
  }


  openConfigMenu(): void {
    const modalRef = this.modalService
                         .open(WebserviceConfigMenuComponent, {size: 'lg'});
    modalRef.componentInstance.node = this.demoNode;
  }

  openSplitPanel(): void {
    this.modalService
        .open(SplitPanelLoginComponent, {size: 'lg'})
  }
}
