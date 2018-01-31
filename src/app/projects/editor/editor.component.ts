import {Component,
        Input,
        OnInit} from '@angular/core';
import {ActivatedRoute,
        Params,
        Router} from '@angular/router';
import {ModalDismissReasons,
        NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as d3 from 'd3';
import * as _ from 'lodash';

import {Graph} from '../../shared/graph.model';
import {Node} from '../../shared/models/node.model';
import {NodeService} from '../../shared/services/node.service';
import {View} from '../../shared/view.model';
import {WebserviceConfigMenuComponent} from '../../webservice-config-menu/webservice-config-menu.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  node: Node;
  rightPanelStyle: Object = {};
  mainSvg;
  graph: Graph;
  closeResult: string;
  views: View[];
  radioOptions: string;

  // Mouse Position, used to insert new nodes onto the coordinate.
  rightClickPos: {x: number, y: number};

  constructor(private nodeService: NodeService, private route: ActivatedRoute, private modalService: NgbModal, private router: Router) {
  }

  ngOnInit() {
    this.views = [];
    this.initPage();
    this.radioOptions = 'editor';
  }

  /* *********************************************************************** */
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
          this.node = node;
          this.initGraph(node);
        });
  }

  /**
     * Initialize the graph view with the corresponding node (single).
     * Thus parentNode will be NULL and NO edge will be shown.
     */
  initGraph(node): void {
    this.mainSvg = d3.select('div#d3-editor').append('svg');
    this.graph = new Graph(this.mainSvg, [node], null);
    this.views.push(new View([node], null));
    this.graph.updateGraph();
  }

  /** Create a composite node of the clicked nodes */
  compositeClickNodes(): void {
    console.log('COMPOSITE CLICKED NODES');

    const OFFSET = -120;
    const node = this.nodeService.createNew({
      x: this.rightClickPos.x,
      y: this.rightClickPos.y + OFFSET
    });

    // Add the clickedNodes as children of this node.
    this.graph.compositeClickNodes(node);

    const oldView = _.last(this.views);    // the view before composition
    const currentView = this.currentView;  // the view after composition;

    // Add the new node as a child of parentNode.
    if (oldView.parentNode) {
      oldView.parentNode.children = currentView.nodes;
      this.nodeService.updateNodeToService(oldView.parentNode);
    }

    // Update the current view nodes and inform nodeService of the new node
    this.replaceRecentView(currentView);
    this.nodeService.add(node);
    this.updateNodesToService(currentView.nodes);

    this.closeContextMenu();
  }

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

      const currentView = _.last(this.views);  // the view before edge;
      const updatedView = this.currentView;    // the view after edge;

      // Add the new node as a child of parentNode.
      if (currentView.parentNode) {
        currentView.parentNode.children = updatedView.nodes;
        this.nodeService.updateNodeToService(currentView.parentNode);
      }

      // Update the current view nodes and inform nodeService of the new node
      currentView.nodes = updatedView.nodes;
      this.updateNodesToService(currentView.nodes);
    }
  }

  detectRightMouseClick($event) {
    if ($event.which === 3) {
      this.rightPanelStyle = {
        'display': 'block',
        'left': ($event.clientX + 1) + 'px',
        'top': ($event.clientY + 1) + 'px'
      };
      this.rightClickPos = {x: $event.clientX, y: $event.clientY};
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

  edit(): void {
    if (this.graph.state.selectedNode) {
      this.openConfigModal();
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


  /** Insert a node onto the graph and updateToService nodeService.
     * Also add the node into its parent.children array. */
  insertNode(): void {
    const OFFSET = -120;
    const node = this.nodeService.createNew({
      x: this.rightClickPos.x,
      y: this.rightClickPos.y + OFFSET
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

  get lastView(): View {
    return _.last(this.views);
  }

  openQuickEditModal(content) {
    this.modalService.open(content).result.then((result) => {
      this.graph.updateGraph();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openConfigModal() {
    const modalRef = this.modalService
                         .open(WebserviceConfigMenuComponent, {size: 'lg'});
    const inputNodes = this.getInputsToNode(this.selectedNode);
    modalRef.componentInstance.node = this.selectedNode;
    modalRef.componentInstance.inputNodes = inputNodes;
    modalRef.result
        .then(
            (result: any) => {
              this.syncNode(this.selectedNode);
              this.drawCurrentView()
            },
            (reason: any) => {
              this.syncNode(this.selectedNode);
              this.drawCurrentView();
            });
  }

  /* Return all the nodes that has an edge to the input node. ignores nodes
    * that doesn't have a "service" */
  getInputsToNode(node: Node): Node[] {
    return this.graph
        .edges
        .filter(edge => (edge.target.id === node.id) && edge.source.service)
        .map(edge => edge.source);
  }

  /* Ensure that the parent.children (nodes) and view.nodes are in sync.
     * they could be out of sync if the user update the title/description */
  syncNode(node: Node): void {
    this.syncParentChild(node);
    this.syncViewNode(node);
  }

  syncParentChild(node: Node): void {
    const childToUpdate = this.graph.parentNode.children
                              .find((n: Node) => n.id === node.id);
    Object.assign(childToUpdate, node);
  }

  syncViewNode(node: Node): void {
    const viewNode = this.lastView
                         .nodes
                         .find((n: Node) => n.id === node.id);
    Object.assign(viewNode, node);
  }

  openNoCompositionModal(content) {
    this.modalService.open(content);
  }

  get nodeClone(): Node {
    return _.cloneDeep(this.node);
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
    const currentView = this.currentView;
    if (currentView.parentNode) {
      currentView.parentNode.children = currentView.nodes;
    }
    this.replaceRecentView(currentView);
    this.updateViewToService(currentView);
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
    const poppedView = this.views.pop();
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
      this.graph = new Graph(
          this.mainSvg, this.selectedNode.children, this.selectedNode);
      this.graph.updateGraph();
      this.views.push(this.graph.currentView);
    }
    this.closeContextMenu();
  }

  viewPerformance(modal): void {
    this.openQuickEditModal(modal);
    this.closeContextMenu();
  }
}
