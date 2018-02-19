import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

import {Component,
        OnInit} from '@angular/core';
import {ActivatedRoute,
        Params,
        Router} from '@angular/router';

import {Node} from '../../shared/models/node.model';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../shared/services/project.service';

@Component({
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  project: Project;
  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params
        .mergeMap((params: Params) => {
          const id = +params['id'];
          return this.projectService.getProject(id);
        })
        .subscribe((value: Project) => {
          if (!value) {
            this.router.navigate(['projects']);
            return;
          }
          this.project = value;
        });
  }

  gotoEditor(isNewProject: boolean): void {
    if (isNewProject) {
      const project = this.projectService.createNew();
      this.router.navigate(['/projects', project.id, 'editor'], 'editor');
    } else {
      this.router.navigate(['/projects', this.project.id, 'editor']);
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
