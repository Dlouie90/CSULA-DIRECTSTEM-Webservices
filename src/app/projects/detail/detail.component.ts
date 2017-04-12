import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NodeService} from '../../shared/node.service';
import {Node} from '../../shared/node.model';
import 'rxjs/add/operator/switchMap';

@Component({
  selector   : 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls  : ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input()
  node: Node;
  editMode: boolean;

  constructor(private nodeService: NodeService,
              private route: ActivatedRoute) {
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

}
