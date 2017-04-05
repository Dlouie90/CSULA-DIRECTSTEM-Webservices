/**
 * An object that represent is used to represent a webservice visually.
 */
export class Node {

  id: number;
  x: number;
  y: number;
  neighbors: Node[];
  children: Node[];
  isInput: boolean;
  isOutput: boolean;
  name: string;

  /** Return true if the node is neither a input or output node. */
  static isRegular(node) {
    return !(node.isInput || node.isOutput);
  }

  constructor(id: number, x: number, y: number) {
    this.id        = id;
    this.x         = x;
    this.y         = y;
    this.neighbors = [];
    this.children  = [];
    this.isInput   = false;
    this.isOutput  = false;
    this.name      = 'webservice-' + id;
  }
}
