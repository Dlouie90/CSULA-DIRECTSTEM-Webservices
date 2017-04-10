import {Component, OnInit} from '@angular/core';
import {NodeService} from '../shared/node.service';
import {Node} from '../shared/node.model';

@Component({
  selector   : 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls  : ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  nodes: Array<Node>;

  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    this.getNodes();
  }

  getNodes(): void {
    this.nodeService.getNodes()
        .then((nodes: Array<Node>) => {
          this.nodes = nodes;
        })
        .catch((error) => {
          console.log(error);
          this.nodes = [];
        });
  }

}
