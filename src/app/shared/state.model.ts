/**
 * Represent the current visual state of the graphs.
 */
export class State {
  nodes: Node[];
  parentNode: Node;

  constructor(nodes = [], parentNode = null) {
    this.nodes      = nodes;
    this.parentNode = parentNode;
  }
}