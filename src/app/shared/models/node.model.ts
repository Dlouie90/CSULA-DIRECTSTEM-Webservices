import {ParameterEntry} from './parameter-entry.model';
import {IService} from './service.interface';

export class Node {
  title: string;
  description: string;
  url: string;
  method: string;
  time_text: string;
  just_benchmarked: boolean;
  composite_id: number;
  param_keys: string[] = [];
  param_vals: string[] = [];

  ///////// PARAMETERS /////////
  params = []; // param objects
  ///////// RESPONSE //////////
  response: string; // response in raw string format
  res_params = []; // parameters from the response object
  ///////// STATISTICS /////////
  stats = []; // stat objects
  type: string;

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
    this.params = [];
    this.stats = [];
    this.url = "";
    this.method = "GET";
    this.type = "REGULAR";
  }
}
