import * as d3 from 'd3';
import * as _ from 'lodash';
import {Component, Input, OnInit} from '@angular/core';
import {Graph} from '../../shared/graph.model';
import {NodeService} from '../../shared/node.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
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
  closeResult: string;

  views: Array<View>;

  constructor(private nodeService: NodeService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private router: Router) {
  }

  ngOnInit() {
    this.views = [];
    this.initPage();
  }

  /* *********************************************************************** */
  /* *********************************************************************** */
  /* *********************************************************************** */

  /** Return the graph's current view, this.graph.currentView */
  get currentView(): View {
    return this.graph.currentView;
  }

  closeContextMenu() {
    this.rightPanelStyle = {'display': 'none'};
  }

  debugNode(content): void {
    if (this.selectedNode) {
      this.modalService.open(content);
    }
    this.closeContextMenu();
  }

  /** Used to keep track of adding an edge */
  detectShiftLMouseUp($event): void {
    if ($event.shiftKey && $event.which === 1) {
      console.log('SHIFT LEFT-MOUSE UP');

      this.updateViewToService(this.currentView);
      this.replaceRecentView(this.currentView);
    }
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

  drawCurrentView() {
    console.log('DRAW CURRENT VIEW');

    const recentView = _.last(this.views);

    /* Reset the svg and load up the previous state */
    this.mainSvg.selectAll('*').remove();
    this.graph = new Graph(
        this.mainSvg, recentView.nodes, recentView.parentNode);
    this.graph.updateGraph();
  }

  edit(content): void {
    if (this.graph.state.selectedNode) {
      this.openQuickEditModal(content);
    }
    this.closeContextMenu();
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

  /**
   * Initialize the graph view with the corresponding node (single).
   * Thus parentNode will be NULL and NO edge will be shown.
   */
  initGraph(node): void {
    this.mainSvg = d3.select('div#d3-editor').append('svg');
    this.graph   = new Graph(this.mainSvg, [node], null);
    this.views.push(this.graph.currentView);
    this.graph.updateGraph();
  }

  /**
   * Retrieve the node that correspond with the route param id value. If
   * it is valid load up the graph of the node, otherwise navigate back to
   * the project page.
   */
  initPage(): void {
    let id;  // Route Param.
    this.route.params
        .switchMap((params: Params) => {
          id = +params['id'];
          return this.nodeService.getNode(id);
        })
        .subscribe((node: Node) => {
          if (!node) {  // Route back to the project page if id doesn't exist.
            console.error(`There are no nodes with the id: ${id}!`);
            console.error('Returning to the project page');
            this.router.navigate(['../../']);
            return;
          }
          this.initGraph(node);
          this.nodeService.select = node;
          return this.node = node;
        });
  }

  /** Insert a node onto the graph and updateToService nodeService.
   * Also add the node into its parent.children array. */
  insertNode($event): void {
    const OFFSET = -120;
    const node   = this.nodeService.createNew({
      x: $event.clientX,
      y: $event.clientY + OFFSET
    });

    /* Update the view to include the new node. */
    const recentView = _.last(this.views);
    if (recentView.parentNode) {
      recentView.parentNode.children.push(node);
      this.nodeService.updateNodeToService(recentView.parentNode);
    }
    recentView.nodes.push(node);
    this.nodeService.add(node);
    this.graph.insertNode(node);

    this.closeContextMenu();
  }

  lastView(): View {
    return _.last(this.views);
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

  openNoCompositionModal(content) {
    this.modalService.open(content);
  }

  removeNodeFromService(node: Node): void {
    return this.nodeService.removeNode(node);
  }

  removeNode(): void {
    console.log('REMOVING NODE');
    this.removeNodeFromService(this.selectedNode);
    this.graph.removeSelectedNode();
    this.closeContextMenu();
  }

  removeEdge(): void {
    console.log('REMOVING EDGE');
    this.graph.removeSelectedEdge();
    this.updateViewToService(this.graph.currentView);
    this.closeContextMenu();
  }

  removeSelected(): void {
    if (this.graph.state.selectedNode) {
      this.removeNode();
    } else if (this.graph.state.selectedEdge) {
      this.removeEdge();
    } else {
      this.closeContextMenu();
    }
  }

  replaceRecentView(newView: View): void {
    this.views.pop();
    this.views.push(newView);
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
    console.log('RETURNING TO PARENT NODE');
    /* Remove the current view and return to the previous view*/
    const poppedView  = this.views.pop();
    const currentView = _.last(this.views);
    this.updateViewFromService(currentView);

    this.drawCurrentView();
    this.closeContextMenu();
  }

  get selectedNode(): Node {
    return this.graph.state.selectedNode;
  }

  /**
   * Update the  nodes with the latest changes. This should be called
   * after navigating to composition view because the user could insert,
   * add children, to a node and thus it would needs to be updated. .*/
  updateNodesFromService(nodes: Array<Node>): void {
    this.nodeService.updateNodesFromService(nodes);
  }

  updateNodeFromService(node: Node): void {
    this.nodeService.updateNodeFromService(node);
  }

  updateViewFromService(view: View): void {
    this.updateNodesFromService(view.nodes);
    this.updateNodeFromService(view.parentNode);
  }

  updateViewToService(view: View): void {
    this.nodeService.updateViewToService(view);
  }

  updateNodeToService(node: Node): void {
    this.nodeService.updateNodeToService(node);
  }

  updateNodesToService(nodes: Array<Node>): void {
    nodes.forEach((n: Node) => {
      this.nodeService.updateNodeToService(n);
    });
  }

  viewComposition(content): void {
    if (this.selectedNode) {
      console.log('VIEWING COMPOSITION');

      /* Alert the users with a modal that this view has no composition nodes */
      if (this.selectedNode.children.length === 0) {
        this.openNoCompositionModal(content);
      }

      this.updateNodeFromService(this.selectedNode);

      this.mainSvg.selectAll('*').remove();
      this.graph = new Graph(this.mainSvg, this.selectedNode.children, this.selectedNode);
      this.views.push(this.graph.currentView);
      this.graph.updateGraph();
    }
    this.closeContextMenu();
  }
}

