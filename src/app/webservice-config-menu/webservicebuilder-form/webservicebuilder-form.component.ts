import {Component,
        Input,
        OnInit,
        OnChanges,
        OnDestroy} from '@angular/core';
import {FormArray,
        FormBuilder,
        FormGroup} from '@angular/forms';
import {Node} from '../../shared/models/node.model';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../shared/services/project.service';

@Component({
  selector: 'app-webservicebuilder-form',
  templateUrl: './webservicebuilder-form.component.html'
})
export class WebServiceBuilderComponent implements OnChanges, OnDestroy {
  @Input()
  project: Project;
  @Input()
  node: Node;
  webserviceForm: FormGroup;
  paramGroup: FormGroup;
  selected;
  methods = ['GET', 'POST', 'PUT', 'DELETE'];
  checked = [true, false, false, false];

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService) {}

  ngOnInit(): void {
    if (!this.node) {
      console.log("can't display node");
      return;
    }

    if(this.node) {
      console.log("displaying node");

      // change default display value
      var index = this.methods.indexOf(this.node.method);
      this.checked[index] = true;

      // save default method
      this.selected = this.node.method;
      this.webserviceForm = this.createFormGroup(this.node);
    }
    this.paramGroup = this.formBuilder.group({});
  }

  ngOnChanges(): void {
    // do something?
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
      method: data.method,
      param_keys: this.createParamKeysFormArray(data.param_keys),
      param_vals: this.createParamValsFormArray(data.param_vals)
    });
  }

  private createParamKeysFormArray(keys:string[]): FormArray {
    const paramKeysControlArray = keys.map((key:string) => this.formBuilder.control(key));
    return this.formBuilder.array(paramKeysControlArray);
  }

  get param_keys(): FormArray {
    return this.webserviceForm.get('param_keys') as FormArray;
  }

  private createParamValsFormArray(vals:string[]): FormArray {
    const inputs = vals.map((val:string) => this.formBuilder.control(val));
    return this.formBuilder.array(inputs);
  }

  get param_vals(): FormArray {
    return this.webserviceForm.get('param_vals') as FormArray;
  }

  testService(): void {
    alert('not implemented yet');
  }

  removeParameter(i): void {
    //alert('not implemented yet');
    console.log("Attemping to remove parameter #" + i + " in node " + this.node.title);
    if(this.node) {
      this.project.nodes.forEach((n:Node) => {
        if(n.id == this.node.id) {
          console.log("Removing parameter from project, too");
          n.param_keys.splice(i, 1);
          n.param_vals.splice(i, 1);
        }
      });
      this.node.param_keys.splice(i, 1);
      this.node.param_vals.splice(i, 1);
      this.param_keys.removeAt(i);
      this.param_vals.removeAt(i);
    }
  }

  addParameter(key:string): void {
    this.param_keys.push(this.formBuilder.control(key));
    this.param_vals.push(this.formBuilder.control(''));
    if(this.node) {
      // search for the right node to update
      this.project.nodes.forEach((n: Node) => {
        if(n.id == this.node.id)
          n.param_keys.push(key);
          n.param_vals.push('');
      });
    }
  }

  saveChange(): void {
    if(this.node) {
      // search for the right node to update
      this.project.nodes.forEach((n: Node) => {
        if(n.id == this.node.id) {
          n.url = this.webserviceForm.get('url').value;
          n.method = this.selected;
          this.param_vals.controls.forEach((form, index) => n.param_vals[index] = form.value);
        }
      });
    }
    
    this.projectService.updateProjectToService(this.project);

    // then save the project to the database
    this.projectService.updateProjectDb(this.project);
  }

  methodChange(event) {
    //console.log(event);
    console.log("chose " + event.target.value);
    this.selected = event.target.value;
  }

  currentMethod(method) {
    return method == this.node.method;
  }
}
