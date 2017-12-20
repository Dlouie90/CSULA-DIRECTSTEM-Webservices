import {Component,
        OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Node} from '../shared/models/node.model';
import {NodeService} from '../shared/services/node.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  nodes: Node[];

  constructor(private nodeService: NodeService, private router: Router) {
  }

  ngOnInit() {
    this.getNodes();
  }

  private getNodes(): void {
    this.nodeService.getNodes()
        .subscribe(
            (nodes: Node[]) => this.nodes = nodes,
            () => {
              this.nodes = [];
              console.log('failed to load nodes, defaulting to empty :', []);
            });
  }

  createNewProject(): void {
    console.log('created new project');
    this.nodeService.createNew();
  }

  navigateToDetail(id: number): void {
    this.router
        .navigate(['projects', id, 'detail'])
        .then(_ => console.log('navigate was successful'))
        .catch(_ => console.log('navigate was not successful'));
  }

  navigateToEditor(id: number): void {
    this.router
        .navigate(['projects', id, 'editor'])
        .then(_ => console.log('navigating to editor\'s page'))
        .catch(_ => console.log('can\'t navigate to editor\'s page'));
  }
}
