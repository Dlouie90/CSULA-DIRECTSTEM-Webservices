import {Property} from './property.model';
/**
 * This class is used to represent a webservice. It has two primary set
 * of properties, graph and profile. The graph properties are the
 * properties used to help visualize the webservice on a graph and
 * the profile properties are used to describe what the webservice does.
 */
export class Node {

  /* Graph Properties */
  id: number;
  x: number;
  y: number;
  neighbors: Node[];
  children: Node[];
  isInput: boolean;
  isOutput: boolean;
  name: string;

  /* Webservice Profile Properties */
  title: string;
  description: string;
  type: string;
  domain: string;
  path: string;
  parameters: Array<Property>;
  returnValues: Array<Property>;

  /** Return true if the node is neither a input or output node. */
  static isRegular(node) {
    return !(node.isInput || node.isOutput);
  }

  static create(id: number) {
    return new Node(id, 300, 100);
  }

  constructor(id: number, x: number, y: number, profile?: Profile) {
    /* Graph Properties */
    this.id        = id;
    this.x         = x;
    this.y         = y;
    this.neighbors = [];
    this.children  = [];
    this.isInput   = false;
    this.isOutput  = false;
    this.name      = 'webservice-' + id;

    /* Webservice Profile Properties */
    if (profile) {
      this.title        = profile.title || null;
      this.description  = profile.description || null;
      this.type         = profile.type || null;
      this.domain       = profile.domain || null;
      this.path         = profile.path || null;
      this.parameters   = profile.parameters || [];
      this.returnValues = profile.returnValues || [];
    }
  }


  addCompositionNode(node: Node): void {
    this.children.push(node);
  }
}

interface Profile {
  title?: string;
  description?: string;
  type?: string;
  domain?: string;
  path?: string;
  parameters?: Array<Property>;
  returnValues?: Array<Property>;
}
