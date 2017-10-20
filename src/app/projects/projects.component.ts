import { Component, OnInit } from '@angular/core';
import { NodeService } from '../shared/services/node.service';
import { Node } from '../shared/models/node.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
    nodes: Array<Node>;

    constructor(private nodeService: NodeService,
                private router: Router) {
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

    createNewProject(): void {
        const node: Node = this.nodeService.createNew();
        this.router.navigate(['projects', node.id, 'editor'])
            .then(_ => console.log('navigate was successful'))
            .catch(_ => console.log('navigate was not successful'));
    }
}
