import {Component, OnInit} from '@angular/core';
import {Node} from '../shared/models/node.model';
import {NodeService} from '../shared/services/node.service';

@Component({
  selector   : 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls  : ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  nodes: Array<Node>;

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    this.nodeService.getNodes()
        .then((ns: Array<Node>) => {
          this.nodes = ns;
        });
  }

}
