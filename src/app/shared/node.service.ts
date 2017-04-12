import {Injectable, OnInit} from '@angular/core';
import {Node} from './node.model';
import {DATA} from './node-mock.data';
import {Subject} from 'rxjs/subject';

@Injectable()
export class NodeService implements OnInit {
  private nodes: Array<Node>;
  private counter: number;

  private selectedNode: Node;
          selectedChanged: Subject<Node> = new Subject<Node>();

  constructor() {
    this.nodes        = [].concat(DATA);
    this.counter      = DATA.length;
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

  add(args: any): void {
    const node = Node.create(this.nextCount());
    this.nodes.push(node);
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
}
