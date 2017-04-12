import {Component, Input, OnInit} from '@angular/core';
import {Node} from '../../shared/node.model';

@Component({
  selector   : 'app-quick-edit',
  templateUrl: './quick-edit.component.html',
  styleUrls  : ['./quick-edit.component.css']
})
export class QuickEditComponent implements OnInit {
  @Input()
  node: Node;

  constructor() {
  }

  ngOnInit() {
  }

}
