import {Component,
        OnInit} from '@angular/core';

import {Project} from '../shared/models/project.model';
import {ProjectService} from '../shared/services/project.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  projects: Project[];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService
        .getProjects()
        .subscribe((projects: Project[]) => this.projects = projects);
  }
}
