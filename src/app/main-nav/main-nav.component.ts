import {Component, OnInit} from '@angular/core';

interface Path {
  title: string;
  url: string;
}
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
      {title: 'Instructions', url: 'instructions'}
    ];
  }

}
