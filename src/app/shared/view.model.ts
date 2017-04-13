import {Node} from './node.model';

/**
 * Represent the current visual state of the graphs.
 */
export class View {
  nodes: Node[];
  parentNode: Node;

  constructor(nodes: Node[] = [], parentNode = null) {
    this.nodes      = nodes;
    this.parentNode = parentNode;
  }
}
