import {Project} from './models/project.model';
import {Node} from './models/node.model';

/**
 * Represent the current visual state of the graphs.
 */
export class View {
  projects: Project[];
  currentProject: Project;
  /*
  nodes: Node[];
  parentNode: Node;
  */

  /*
  constructor(nodes: Node[] = [], parentNode = null) {
    this.nodes = nodes;
    this.parentNode = parentNode;
  }
  */

  constructor(projects: Project[] = [], currentProject = null) {
    this.projects = projects;
    this.currentProject = currentProject;
  }
}
