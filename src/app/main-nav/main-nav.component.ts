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
      {title: 'Project', url: 'project'},
      {title: 'Profile', url: 'profile', disable: true},
      {title: 'Instruction', url: 'instruction'},
    ];
  }

}
