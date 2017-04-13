import * as d3 from 'd3';
import * as _ from 'lodash';
import {Component, Input, OnInit} from '@angular/core';
import {Graph} from '../../shared/graph.model';
import {NodeService} from '../../shared/node.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Node} from '../../shared/node.model';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {View} from '../../shared/view.model';

@Component({
  selector   : 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls  : ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input()
  node: Node;

  rightPanelStyle: Object = {};
  mainSvg;
  graph: Graph;
  selectedNode: Node;
  closeResult: string;

  views: Array<View>;

  constructor(private nodeService: NodeService,
              private route: ActivatedRoute,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.views = [];
    this.checkRouteParams();
  }

  checkRouteParams(): void {
    this.route.params
        .switchMap((params: Params) => {
          return this.nodeService.getNode(+params['id']);
        })
        .subscribe((node: Node) => {
          this.initGraph(node);
          this.nodeService.select = node;
          return this.node = node;
        });
  }

  initGraph(node): void {
    this.mainSvg = d3.select('div#d3-editor').append('svg');
    this.graph   = new Graph(this.mainSvg, [node], null);
    this.views.push(this.graph.currentView);
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

  /** Insert a node onto the graph and update nodeService.
   * Also add the node into its parent.children array. */
  insert($event): void {
    const OFFSET = -120;
    const node   = this.nodeService.createNew({
      x: $event.clientX,
      y: $event.clientY + OFFSET
    });

    /* Update the view to include the new node. */
    const recentView = _.last(this.views);
    if (recentView.parentNode) {
      recentView.parentNode.children.push(node);
      recentView.nodes.push(node);
      this.nodeService.update(recentView.parentNode);
    }

    this.graph.insertNode(node);
    this.closeContextMenu();
  }

  updateSelected(): void {
    this.selectedNode = this.graph.state.selectedNode;
  }

  remove(): void {
    this.graph.remove();
    this.removeNodeFromService();
    this.closeContextMenu();
  }

  edit(content): void {

    if (this.graph.state.selectedNode) {
      this.openQuickEditModal(content);
    }
    this.closeContextMenu();
  }

  openQuickEditModal(content) {
    this.modalService.open(content).result
        .then((result) => {
          this.graph.updateGraph();
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  removeNodeFromService(): void {
    this.nodeService.remove(this.selectedNode);
  }

  openNoCompositionModal(content) {
    this.modalService.open(content);
  }

  viewComposition(content): void {
    if (this.selectedNode) {

      /* Alert the users with a modal that this view has no composition nodes */
      if (this.selectedNode.children.length === 0) {
        this.openNoCompositionModal(content);
      }

      this.mainSvg.selectAll('*').remove();
      this.graph = new Graph(this.mainSvg, this.selectedNode.children, this.selectedNode);
      this.views.push(this.graph.currentView);
      this.graph.updateGraph();
    }

    this.closeContextMenu();
  }

  /**
   * Navigate back to the parent node. Use to traverse back from
   * a composition view by one level. */
  returnToParent() {
    /* Don't undo if the user only have 1 view left
     * because it is the main graph view. */
    if (this.views.length <= 1) {
      this.closeContextMenu();
      return;
    }

    /* Remove the previous view and draw the current one. */
    this.views.pop();
    this.updateNodes(_.last(this.views).nodes);
    this.drawCurrentView();
    this.closeContextMenu();
  }

  drawCurrentView() {
    const recentView = _.last(this.views);

    /* Reset the svg and load up the previous state */
    this.mainSvg.selectAll('*').remove();
    this.graph = new Graph(
        this.mainSvg, recentView.nodes, recentView.parentNode);
    this.graph.updateGraph();
  }

  /**
   * Update the  nodes with the latest changes. This should be called
   * after navigating to composition view because the user could insert,
   * add children, to a node and thus it would needs to be updated. .*/
  updateNodes(nodes: Array<Node>): void {
    nodes.forEach((n: Node) => {
      this.nodeService.refreshNode(n);
    });
  }

}

