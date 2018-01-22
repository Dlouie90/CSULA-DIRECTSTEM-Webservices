import {Component,
        Input,
        OnChanges} from '@angular/core';
import {FormArray,
        FormBuilder,
        FormGroup} from '@angular/forms';
import {IService} from '../../shared/models/service.interface';

@Component({
  selector: 'app-webservice-form',
  templateUrl: './webservice-form.component.html',
  styleUrls: ['./webservice-form.component.css']
})
export class WebserviceFormComponent implements OnChanges {
  @Input()
  service: IService;
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnChanges(): void {
    this.formGroup = this.createFormGroup(this.service);
  }

  private createFormGroup(service: IService): FormGroup {
    const form = this.formBuilder.group({
      id: (service && service.id) || '',
      title: (service && service.title) || '',
      description: (service && service.description) || '',
      url: (service && service.url) || '',
      parameters: this.createParamsFormArray(
          (service && service.parameters) || [])
    });
    // these forms show existing serviceNode info. the user don't need to
    // edit them so we "disabled" it
    form.disable();
    return form;
  }

  private createParamsFormArray(params: string[]): FormArray {
    const paramFormControls = params
                                  .map(param => this.formBuilder.control(param));
    const paramFormArray = this.formBuilder.array(paramFormControls);
    paramFormArray.disable();
    return paramFormArray;
  }

  get parameters(): FormArray {
    return this.formGroup.get('parameters') as FormArray;
  }
}
