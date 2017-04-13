import * as d3 from 'd3';
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

  insert($event): void {
    const node = this.nodeService.createNew({
      x: $event.clientX,
      y: $event.clientY - 80
    });
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
      this.open(content);
    }
    this.closeContextMenu();
  }

  open(content) {
    this.modalService.open(content).result
        .then((result) => {
          this.graph.updateGraph();
          this.saveToService();
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

  saveToService(): void {
    if (this.selectedNode) {
      this.nodeService.update(this.selectedNode);
    } else {
      console.error('select a node to save first');
    }
  }

  removeNodeFromService(): void {
    this.nodeService.remove(this.selectedNode);
  }

  viewComposition(): void {
    if (this.selectedNode && this.selectedNode.children.length > 0) {
      this.mainSvg.selectAll('*').remove();
      this.graph = new Graph(this.mainSvg, this.selectedNode.children, this.selectedNode);
      this.views.push(this.graph.currentView);
      this.graph.updateGraph();
    }

    this.closeContextMenu();
  }

  goBackOneLevel() {
    /* Don't undo if the user only have history state on the
     * stack because it is the main graph view. */
    if (this.views.length <= 1) {
      return;
    }

    /* Remove the current state from history. */
    this.views.pop();

    /* Draw a graph of the state on top of the history stack */
    this.drawCurrentView();
  }

  drawCurrentView() {
    const recentView = this.views[this.views.length - 1];

    /* Reset the svg and load up the previous state */
    this.mainSvg.selectAll('*').remove();
    this.graph = new Graph(
        this.mainSvg, recentView.nodes, recentView.parentNode);
    this.graph.updateGraph();
  }

  onViewSelect($event: number): void {
    this.views.splice($event + 1);
    this.drawCurrentView();
  }

}

