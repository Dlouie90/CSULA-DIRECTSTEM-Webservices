import {Component, OnDestroy, OnInit} from '@angular/core';
import {Path} from '../shared/path.interface';
import {NodeService} from '../shared/node.service';
import {Node} from '../shared/node.model';

@Component({
  selector   : 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls  : ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy {

  selectedNode: Node;
  paths: Path[];
  _subscription: any;

  constructor(private nodeService: NodeService) {
    this.selectedNode = nodeService.select;

    this._subscription = nodeService.selectedChanged.subscribe((value) => {
      this.selectedNode = value;
    });
  }

  ngOnInit() {
    this.paths = [
      {title: 'Home', url: 'home'},
      {title: 'Projects', url: 'projects'},
      {title: 'Dashboard', url: 'dashboard', disable: true},
      {title: 'Debug', url: 'debug'}
    ];
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
