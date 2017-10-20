import {Node} from './models/node.model';

/** Provides utility methods for Node class.
 *
 * Parsing/stringifying a javascript class will
 * return an object,thus losing
 */
export class NodeUtility {
  static title(node: Node): string {
    return node.title ? node.title.toUpperCase() : `NODE-ID-${node.id}`;
  }
}
