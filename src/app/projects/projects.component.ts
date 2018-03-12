import {Component,
        OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Project} from '../shared/models/project.model';
import {ProjectService} from '../shared/services/project.service';
//import {Node} from '../shared/models/node.model';
//import {NodeService} from '../shared/services/node.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  /*nodes: Node[];*/

  constructor(private projectService: ProjectService, private router: Router) {
  }

  ngOnInit() {
    console.log('loading projects');
    this.getProjects();
  }

  private getProjects(): void {
    this.projectService.getProjects()
        .subscribe(
            (projects: Project[]) => this.projects = projects,
            () => {
              this.projects = [];
              console.log('failed to load projects, defaulting to empty :', []);
            });
  }

  createNewProject(): void {
    console.log('created new project');
    this.projectService.createNew();
  }

  deleteProject(project_id: number):void {
    var index = this.projects.findIndex((p:Project) => p.id == project_id);
    if (index < 0) {
      console.log("ERROR: COULD NOT FIND PROJECT WITH ID=" + project_id);
    }
    var project = this.projects[index];
    this.projectService.removeProject(project);
  }

  navigateToDetail(id: number): void {
    this.router
        .navigate(['projects', id, 'detail'])
        .then(_ => console.log('navigate was successful'))
        .catch(_ => console.log('navigate was not successful'));
  }

  navigateToEditor(id: number): void {
    this.router
        .navigate(['projects', id, 'editor'])
        .then(_ => console.log('navigating to editor\'s page'))
        .catch(_ => console.log('can\'t navigate to editor\'s page'));
  }
}
