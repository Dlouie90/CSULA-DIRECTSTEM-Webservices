import {Component, OnInit} from '@angular/core';
import {Path} from '../shared/path.interface';

@Component({
  selector   : 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls  : ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  paths: Path[];

  constructor() {
  }

  ngOnInit() {
    this.paths = [
      {title: 'Home', url: 'home'},
      {title: 'Projects', url: 'projects'},
      {title: 'Editor', url: 'editor/0'},
      {title: 'Dashboard', url: 'dashboard', disable: true},
      {title: 'Profile', url: 'profile', disable: true},
    ];
  }

}
