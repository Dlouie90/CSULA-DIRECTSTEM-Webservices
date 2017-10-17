import { Component, Input, OnChanges } from '@angular/core';
import { ServiceNode } from '../models/webservice.models';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-webservice-form',
    templateUrl: './webservice-form.component.html',
    styleUrls: ['./webservice-form.component.css']
})
export class WebserviceFormComponent implements OnChanges {
    @Input() serviceNode: ServiceNode;
    formGroup: FormGroup;


    constructor(private formBuilder: FormBuilder) { }

    ngOnChanges(): void {
        this.formGroup = this.createFormGroup(this.serviceNode);
    }

    createFormGroup(node: ServiceNode): FormGroup {
        if (!node) {
            return this.emptyFormGroup;
        }

        const service = node.service;

        const form = this.formBuilder.group({
            id: service.id,
            title: service.title,
            description: service.description,
            url: service.url,
            parameters: this.createParamsFormArray(service.parameters)
        });
        // these forms show existing serviceNode info. the user don't need to
        // edit them so we "disabled" it
        form.disable();
        return form;
    }

    createParamsFormArray(params: string[]): FormArray {
        const paramFormControls = params
            .map(param => this.formBuilder.control(param));
        const paramFormArray = this.formBuilder.array(paramFormControls);
        paramFormArray.disable();
        return paramFormArray;
    }

    get parameters(): FormArray {
        return this.formGroup.get('parameters') as FormArray;
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
}
