import {Component,
        Input,
        OnChanges,
        OnDestroy} from '@angular/core';
import {FormArray,
        FormBuilder,
        FormGroup} from '@angular/forms';
import {Node} from '../../shared/models/node.model';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../shared/services/project.service';

@Component({
  selector: 'app-composition-form',
  templateUrl: './composition-form.component.html'
})
export class CompositionFormComponent implements OnChanges, OnDestroy {
  @Input()
  project: Project;
  @Input()
  node: Node;
  projectForm: FormGroup;
  paramGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService) {}

  ngOnChanges(): void {
    if (!this.project && !this.node) {
      return;
    }

    if(!this.node) {
      console.log("displaying project");
      this.projectForm = this.createFormGroup(this.project);
    }
    else {
      console.log("displaying node");
      this.projectForm = this.createFormGroup(this.node);
    }
    this.paramGroup = this.formBuilder.group({});
  }

  ngOnDestroy(): void {
    this.saveChange();
  }

  private createFormGroup(data): FormGroup {
    return this.formBuilder.group({
      id: data.id,
      title: data.title,
      description: data.description,
      url: data.url
    });
  }

  saveChange(): void {
    if(!this.node) {
      //this.project.parameters.push(param);
      // search for the right project to update
      this.project.title = this.projectForm.get('title').value;
      this.project.description = this.projectForm.get('description').value;
    }
    else {
      // search for the right node to update
      this.project.nodes.forEach((n: Node) => {
        if(n.id == this.node.id) {
          n.title = this.projectForm.get('title').value;
          n.description = this.projectForm.get('description').value;
        }
      });
    }
    
    this.projectService.updateProjectToService(this.project);
  }
}
