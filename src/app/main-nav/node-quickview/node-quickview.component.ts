import {Component, Input, OnInit} from '@angular/core';
import {NodeUtility} from '../../shared/node-utility.model';
import {Node} from '../../shared/node.model';

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

  get nodeTitle(): string {
    return NodeUtility.title(this.node);
  }

}
