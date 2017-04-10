import {Injectable, OnInit} from '@angular/core';
import {Node} from './node.model';
import {DATA} from './node-mock.data';

@Injectable()
export class NodeService implements OnInit {
  private nodes: Array<Node>;
  private counter: number;

  constructor() {
    this.nodes   = [].concat(DATA);
    this.counter = DATA.length;
  }

  ngOnInit(): void {
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
