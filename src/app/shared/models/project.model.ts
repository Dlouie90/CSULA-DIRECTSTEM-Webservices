import {ParameterEntry} from './parameter-entry.model';
import {IService} from './service.interface';
import {Node} from './node.model';

export class Project {
  title: string;
  description: string;
  url: string;
  service: IService;
  parameters: string[] = [];
  parameterEntries: ParameterEntry[] = [];
  headNode: Node;
  nodes: Node[] = [];
  /*inputEntries: InputEntry[] = [];*/

  /** Return true if the node is neither a input or output node.
  static isRegular(node) {
    return !(node.isInput || node.isOutput);
  }
  */

  static create(id: number) {
    return new Project(id);
  }

  /*static nodeTitle(node: Node): string{
    return node.title || `NODE-${node.id}`
  }*/
  static projectTitle(project: Project): string {
    return project.title || `PROJECT_${project.id}`
  }

  constructor(public id: number) {
    this.title = `PROJECT_${id}`;
  }
}

/** Map a parameter to a "Node". This mean that the output, result, of the
 * node should be feed to the "parameter"
export class InputEntry {
  fromNode: Node;
  toParameter: string;
}
*/