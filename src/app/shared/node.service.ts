import {Injectable, OnInit} from '@angular/core';
import {Node} from './node.model';
import {DATA} from './node-mock.data';
import {Subject} from 'rxjs/Subject';
import {View} from './view.model';

@Injectable()
export class NodeService implements OnInit {
  private nodes: Array<Node>;
  private counter: number;

  private selectedNode: Node;
          selectedChanged: Subject<Node> = new Subject<Node>();

  constructor() {
    this.nodes   = [].concat(DATA);
    this.counter = DATA.length;
  }

  ngOnInit(): void {
  }


  set select(node) {
    this.selectedNode = node;
    this.selectedChanged.next(node);
  }

  get select() {
    return this.selectedNode;
  }

  createNew(pos?: { x: number, y: number }): Node {
    if (pos) {
      const node = new Node(this.nextCount(), pos.x, pos.y);
      this.nodes.push(node);
      return node;
    } else {
      const node = Node.create(this.nextCount());
      this.nodes.push(node);
      return node;
    }
  }

  nextCount(): number {
    return this.counter++;
  }

  getNodes(): Promise<Node[]> {
    return Promise.resolve(this.nodes);
  }

  getNode(id: number): Promise<Node> {
    return this.getNodes()
        .then((nodes: Node[]) => nodes.find((node: Node) => node.id === id));
  }

  /** Insert a new node if it is unique (by id) */
  add(node: Node): boolean {
    if (this.nodes.findIndex((n: Node) => n.id === node.id)) {
      return false;  // not unique
    } else {
      this.nodes.push(node);
      return true;
    }
  }

  /** Update the nodes with the latest changes. */
  updateNodeFromService(node: Node) {
    if (node) {
      const freshNode = this.nodes.find((n: Node) => n.id === node.id);
      Object.assign(node, freshNode);
    } else {
      console.error('you tried to update this node:', node);
    }
  }

  updateNodesFromService(nodes: Array<Node>): void {
    nodes.forEach((n: Node) => {
      this.updateNodeFromService(n);
    });
  }

  /** Update the node onto the service. */
  updateNodeToService(node: Node): boolean {
    const serviceNode = this.nodes.find((n: Node) => n.id === node.id);
    if (serviceNode) {
      Object.assign(serviceNode, node);
      return true;
    }
    return false;
  }

  updateNodesToService(nodes: Array<Node>): void {
    nodes.forEach((n: Node) => {
      this.updateNodeToService(n);
    });
  }

  updateViewToService(view: View): void {
    this.updateNodesToService(view.nodes);
    this.updateNodeToService(view.parentNode);
  }

  /**
   * Remove the node from the services and remove it from all the arrays
   * e.g.(children, neighbors, etc...)
   */
  removeNode(node: Node): void {
    if (!node) {
      console.error('You just tried to removed a undefined or null Node');
      return;
    }

    this.removeNodeFromArray(node, this.nodes);
    this.nodes.forEach((n: Node) => {
      this.removeNodeFromArray(node, n.neighbors);
      this.removeNodeFromArray(node, n.children);
      this.removeNodeFromArray(node, n.inputNodes);
      this.removeNodeFromArray(node, n.outputNodes);
    });
  }


  private removeNodeFromArray(node: Node, array: Array<Node>): void {
    const index = array.findIndex((n: Node) => n.id === node.id);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

}
