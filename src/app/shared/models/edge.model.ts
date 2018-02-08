export class Edge {
  weight: number;
  source: Node;
  target: Node;

  static create(from_node: Node, to_node: Node) {
    return new Edge(from_node, to_node, 0);
  }

  constructor(public from_node: Node, public to_node: Node, public _weight: number) {
    this.source = from_node;
    this.target = to_node;
    this.weight = _weight;
  }
}
