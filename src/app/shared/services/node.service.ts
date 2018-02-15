import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/find';
import 'rxjs/add/observable/from';

import {Injectable} from '@angular/core';
import {Http,
        Response} from '@angular/http';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {Node} from '../models/node.model';
import {IService} from '../models/service.interface';
import {View} from '../view.model';

@Injectable()
export class NodeService {
  private baseUrl = '/webservice/rest';
  private nodes: Node[] = [];
  titleChangeSubject = new Subject<Node>();

  static sortServicesById(services: IService[]): IService[] {
    return _.sortBy(services, ['id']);
  }

  /**
     * TODO: get primary key from the database instead of this.
     * Generate a primary key between 1 and 999,999,999
     */
  static generateTempId(): number {
    return Math.trunc(Math.random() * 999999999) + 1;
  }


  constructor(private http: Http) {}

  getServices(): Observable<IService[]> {
    const url = `${this.baseUrl}/comp/listservices`;
    return this.http.get(url)
        .map((response: Response) => {
          const services = response.json().result as IService[];
          return NodeService.sortServicesById(services);
        });
  }

  /* Delete all the services except for the 'defaults'*/
  resetService(): Observable<Response> {
    const url = `${this.baseUrl}/comp/bulkdel`;
    return this.http
        .post(url, {});
  }


  createNew(pos?: {x: number, y: number}): Node {
    if (pos) {
      const node = new Node("NODE", NodeService.generateTempId(), pos.x, pos.y);
      this.nodes.push(node);
      return node;
    } else {
      const node = Node.create(NodeService.generateTempId());
      this.nodes.push(node);
      return node;
    }
  }

  getNodes(): Observable<Node[]> {
    return Observable.of(this.nodes);
  }

  getNode(id: number): Observable<Node> {
    return Observable.from(this.nodes)
        .find((node: Node) => node.id === id);
  }

  /** Insert a new node if it is unique (by id) */
  add(node: Node): boolean {
    if (this.nodes.findIndex((n: Node) => n.id === node.id)) {
      return false;  // not unique
    } else {
      this.nodes.push(node);
      return true;
    }
  }

  /** Update the nodes with the latest changes. */
  updateNodeFromService(node: Node) {
    if (node) {
      const freshNode = this.nodes.find((n: Node) => n.id === node.id);
      Object.assign(node, freshNode);
    } else {
      console.error('you tried to update this node:', node);
    }
  }

  updateNodesFromService(nodes: Array<Node>): void {
    nodes.forEach((n: Node) => {
      this.updateNodeFromService(n);
    });
  }

  /** Update the node onto the service. */
  updateNodeToService(node: Node): boolean {
    if (!node) {
      return false;
    }

    const serviceNode = this.nodes.find((n: Node) => n.id === node.id);
    if (serviceNode) {
      Object.assign(serviceNode, node);
      return true;
    }
    return false;
  }

  updateNodesToService(nodes: Array<Node>): void {
    nodes.forEach((n: Node) => {
      this.updateNodeToService(n);
    });
  }

  updateViewToService(view: View): void {
    this.updateNodesToService(view.currentProject.nodes);
    this.updateNodeToService(view.currentProject.headNode);
  }

  /**
     * Remove the node from the services and remove it from all the arrays
     * e.g.(children, neighbors, etc...)
     */
  removeNode(node: Node): void {
    if (!node) {
      console.error('You just tried to removed a undefined or null Node');
      return;
    }

    this.removeNodeFromArray(node, this.nodes);
    this.nodes.forEach((n: Node) => {
      this.removeNodeFromArray(node, n.neighbors);
      this.removeNodeFromArray(node, n.children);
    });
  }

  private removeNodeFromArray(node: Node, array: Array<Node>): void {
    const index = array.findIndex((n: Node) => n.id === node.id);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
