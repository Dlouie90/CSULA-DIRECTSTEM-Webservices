import * as d3 from 'd3';
import {Component, Input, OnInit} from '@angular/core';
import {Graph} from '../shared/graph.model';
import {NodeService} from '../shared/node.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Node} from '../shared/node.model';

@Component({
  selector   : 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls  : ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input()
  node: Node;

  rightPanelStyle: Object = {};
  graph: Graph;
  selectedNode;

  constructor(private nodeService: NodeService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.checkRouteParams();
  }

  checkRouteParams(): void {
    this.route.params
        .switchMap((params: Params) => {
          return this.nodeService.getNode(+params['id']);
        })
        .subscribe((node: Node) => {
          this.initGraph(node);
          return this.node = node;
        });
  }

  initGraph(node): void {
    const mainSvg = d3.select('div#d3-editor').append('svg');
    this.graph    = new Graph(mainSvg, [node], null);
    this.graph.updateGraph();
  }

  detectRightMouseClick($event) {
    if ($event.which === 3) {
      this.rightPanelStyle = {
        'display': 'block',
        'left'   : ($event.clientX + 1) + 'px',
        'top'    : ($event.clientY + 1) + 'px'
      };
      return false;
    }
  }

  closeContextMenu() {
    this.rightPanelStyle = {'display': 'none'};
  }

  insert($event): void {
    this.graph.insertNode($event.clientX, $event.clientY - 80);
    this.closeContextMenu();
  }

  updateSelected(): void {
    this.selectedNode = this.graph.state.selectedNode;
  }

  delete(): void {
    this.graph.delete();
    this.closeContextMenu();
  }
}
