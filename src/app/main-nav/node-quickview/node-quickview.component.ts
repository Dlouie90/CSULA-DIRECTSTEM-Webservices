import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector   : 'app-node-quickview',
  templateUrl: './node-quickview.component.html',
  styleUrls  : ['./node-quickview.component.css']
})
export class NodeQuickviewComponent implements OnInit {
  @Input()
  node: Node;

  constructor() {
  }

  ngOnInit() {
  }

}
