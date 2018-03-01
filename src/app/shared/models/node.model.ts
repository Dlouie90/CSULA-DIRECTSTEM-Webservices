import {ParameterEntry} from './parameter-entry.model';
import {IService} from './service.interface';

export class Node {
  title: string;
  description: string;
  url: string;
  time_text: string;
  just_benchmarked: boolean;
  composite_id: number;
  parameters: string[] = [];
  parameterEntries: ParameterEntry[] = [];

  /** Return true if the node is neither a input or output node. */
  static isRegular(node) {
    return !(node.isInput || node.isOutput);
  }

  static create(id: number) {
    return new Node(id, 300, 100);
  }

  static nodeTitle(node: Node): string{
      return node.title || `NODE-${node.id}`}

  constructor(public id: number, public x: number, public y: number) {
    this.title = `NODE_${id}`;
    this.time_text  = '';
    this.just_benchmarked = false;
  }
}

/** Map a parameter to a "Node". This mean that the output, result, of the
 * node should be feed to the "parameter" */
export class InputEntry {
  fromNode: Node;
  toParameter: string;
}
