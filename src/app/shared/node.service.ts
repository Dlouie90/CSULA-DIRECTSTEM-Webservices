import {Injectable, OnInit} from '@angular/core';
import {Node} from './node.model';
import {DATA} from './node-mock.data';
import {Subject} from 'rxjs/Subject';

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

  update(node: Node): boolean {
    const nodeToUpdate = this.nodes.find((n: Node) => n.id === node.id);
    if (nodeToUpdate) {
      Object.assign(nodeToUpdate, node);
      return true;
    }
    return false;
  }

  remove(node: Node): boolean {
    const indexNodeToRemove = this.nodes.findIndex((n: Node) => n.id === node.id);
    if (indexNodeToRemove !== -1) {
      this.nodes.splice(indexNodeToRemove, 1);
      return true;
    }
    return false;
  }
}
