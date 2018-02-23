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
      url: data.url,
      parameters: this.createParameterFormArray(data),
      demoInputs: this.createDemoInputsFormsArray(data.parameters)
    });
  }

  private createParameterFormArray(data): FormArray {
    const paramControlArray = data
                              .parameters
                              .map((param: string) => this.formBuilder.control(param));
    return this.formBuilder.array(paramControlArray);
  }

  get parameters(): FormArray {
    return this.projectForm.get('parameters') as FormArray;
  }

  private createDemoInputsFormsArray(parameters: string[]): FormArray {
    const inputs = parameters
                       .map(_ => this.formBuilder.control(''));
    return this.formBuilder.array(inputs);
  }

  get demoInputs(): FormArray {
    return this.projectForm.get('demoInputs') as FormArray;
  }

  testService(): void {
    alert('not implemented yet');
  }

  removeParameter(): void {
    alert('not implemented yet');
  }

  addParameter(param: string): void {
    this.parameters.push(this.formBuilder.control(param));
    this.demoInputs.push(this.formBuilder.control(''));
    if(!this.node)
      this.project.parameters.push(param);
    else {
      // search for the right node to update
      this.project.nodes.forEach((n: Node) => {
        if(n.id == this.node.id)
          n.parameters.push(param);
      });
    }
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

    // then save the project to the database
    this.projectService.updateProjectDb(this.project);
  }
}
