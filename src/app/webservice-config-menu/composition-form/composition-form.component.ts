import {Component,
        Input,
        OnChanges,
        OnDestroy} from '@angular/core';
import {FormArray,
        FormBuilder,
        FormGroup} from '@angular/forms';
import {Node} from '../../shared/models/node.model';
import {NodeService} from '../../shared/services/node.service';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../shared/services/project.service';

@Component({
  selector: 'app-composition-form',
  templateUrl: './composition-form.component.html'
})
export class CompositionFormComponent implements OnChanges, OnDestroy {
  @Input()
  project: Project;
  projectForm: FormGroup;
  paramGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService) {}

  ngOnChanges(): void {
    if (!this.project) {
      return;
    }

    this.projectForm = this.createFormGroup(this.project);
    this.paramGroup = this.formBuilder.group({});
  }

  ngOnDestroy(): void {
    this.saveChange();
  }

  private createFormGroup(project: Project): FormGroup {
    return this.formBuilder.group({
      id: project.id,
      title: project.title,
      description: project.description,
      url: project.url,
      parameters: this.createParameterFormArray(project),
      demoInputs: this.createDemoInputsFormsArray(project.parameters)
    });
  }

  private createParameterFormArray(project: Project): FormArray {
    const paramControlArray = project
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
    this.project.parameters.push(param);
  }

  saveChange(): void {
    this.project.title = this.projectForm.get('title').value;
    this.project.description = this.projectForm.get('description').value;
    this.projectService.updateProjectToService(this.project);
  }
}
