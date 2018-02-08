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

import {Project} from '../models/project.model';
import {IService} from '../models/service.interface';
import {View} from '../view.model';

@Injectable()
export class ProjectService {
  private baseUrl = '/webservice/rest';
  private projects: Project[] = [];
  titleChangeSubject = new Subject<Project>();

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
          return ProjectService.sortServicesById(services);
        });
  }

  /* Delete all the services except for the 'defaults'*/
  resetService(): Observable<Response> {
    const url = `${this.baseUrl}/comp/bulkdel`;
    return this.http
        .post(url, {});
  }

  createNew(): Project {
    const project = new Project(ProjectService.generateTempId());
    this.projects.push(project);
    return project;
  }

  getProjects(): Observable<Project[]> {
    return Observable.of(this.projects);
  }

  getProject(id: number): Observable<Project> {
    return Observable.from(this.projects)
        .find((project: Project) => project.id === id);
  }

  /** Insert a new project if it is unique (by id) */
  add(project: Project): boolean {
    if (this.projects.findIndex((p: Project) => p.id === project.id)) {
      return false;  // not unique
    } else {
      this.projects.push(project);
      return true;
    }
  }

  /** Update the projects with the latest changes. */
  updateProjectFromService(project: Project) {
    if (project) {
      const freshProject = this.projects.find((p: Project) => p.id === project.id);
      Object.assign(project, freshProject);
    } else {
      console.error('you tried to update this project:', project);
    }
  }

  updateProjectsFromService(projects: Array<Project>): void {
    projects.forEach((p: Project) => {
      this.updateProjectFromService(p);
    });
  }

  /** Update the project onto the service. */
  updateProjectToService(project: Project): boolean {
    if (!project) {
      return false;
    }

    const serviceProject = this.projects.find((p: Project) => p.id === project.id);
    if (serviceProject) {
      Object.assign(serviceProject, project);
      return true;
    }
    return false;
  }

  updateProjectsToService(projects: Array<Project>): void {
    projects.forEach((p: Project) => {
      this.updateProjectToService(p);
    });
  }

  updateViewToService(view: View): void {
    this.updateProjectToService(view.currentProject);
    /*this.updateProjectToService(view.parentProject);*/
  }

  /**
     * Remove the project from the services and remove it from all the arrays
     * e.g.(children, neighbors, etc...)
     */
  removeProject(project: Project): void {
    if (!project) {
      console.error('You just tried to removed a undefined or null Project');
      return;
    }

    this.removeProjectFromArray(project, this.projects);
    /*
    this.projects.forEach((p: Project) => {
      this.removeProjectFromArray(project, p.neighbors);
      this.removeProjectFromArray(project, p.children);
    });
    */
  }

  private removeProjectFromArray(project: Project, array: Array<Project>): void {
    const index = array.findIndex((p: Project) => p.id === project.id);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
