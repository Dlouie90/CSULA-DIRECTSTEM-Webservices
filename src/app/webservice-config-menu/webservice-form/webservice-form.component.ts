import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Node } from '../../shared/models/node.model';

@Component({
    selector: 'app-webservice-form',
    templateUrl: './webservice-form.component.html',
    styleUrls: ['./webservice-form.component.css']
})
export class WebserviceFormComponent implements OnChanges {
    @Input() node: Node;
    formGroup: FormGroup;


    constructor(private formBuilder: FormBuilder) { }

    ngOnChanges(): void {
        this.formGroup = this.createFormGroup(this.node);
    }

    private createFormGroup(node: Node): FormGroup {
        if (!node) {
            return this.emptyFormGroup;
        }

        const form = this.formBuilder.group({
            id: node.serviceId,
            title: node.serviceTitle,
            description: node.serviceDescription,
            url: node.serviceUrl,
            parameters: this.createParamsFormArray(node.serviceParameters)
        });
        // these forms show existing serviceNode info. the user don't need to
        // edit them so we "disabled" it
        form.disable();
        return form;
    }

    private get emptyFormGroup(): FormGroup {
        const emptyFormGroup = this.formBuilder.group({
            id: '',
            title: '',
            description: '',
            url: '',
            parameters: this.formBuilder.array([])
        });
        emptyFormGroup.disable();
        return emptyFormGroup;
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
