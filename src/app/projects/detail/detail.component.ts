import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NodeService} from '../../shared/node.service';
import {Node} from '../../shared/node.model';
import 'rxjs/add/operator/switchMap';
import * as _ from 'lodash';

@Component({
  templateUrl: './detail.component.html',
  styleUrls  : ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input()
  node: Node;
  editMode: boolean;

  constructor(private nodeService: NodeService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params
        .switchMap((params: Params) => {
          return this.nodeService.getNode(+params['id']);
        })
        .subscribe((node: Node) => {
          return this.node = node;
        });
    this.editMode = false;
  }

  nodeClone(): Node {
    return _.cloneDeep(this.node);
  }

  gotoEditor(isNewProject: boolean): void {
    if (isNewProject) {
      const node = this.nodeService.createNew();
      this.router.navigate(['/projects', node.id, 'editor'], 'editor');
    } else {
      this.router.navigate(['/projects', this.node.id, 'editor']);
    }
  }

  gotoVisiual(): void {
    this.router.navigate(['/projects', this.node.id, 'visual']);
  }
}
