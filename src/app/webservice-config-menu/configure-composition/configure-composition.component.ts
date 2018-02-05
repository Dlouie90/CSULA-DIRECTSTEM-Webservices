import {Component,
        Input} from '@angular/core';
import {Node} from '../../shared/models/node.model';
import {Project} from '../../shared/models/project.model';

@Component({
  selector: 'app-configure-composition',
  templateUrl: './configure-composition.component.html',
  styleUrls: ['./configure-composition.component.css']
})
export class ConfigureCompositionComponent {
  @Input()
  project: Project;
  @Input()
  inputProjects: Project[];
  selectedProject: Project;

  /* TODO: Implement onChange */
  onChange(value: any): void {}
}
