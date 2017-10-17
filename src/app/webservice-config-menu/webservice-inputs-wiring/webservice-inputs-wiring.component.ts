import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ServiceNode } from '../models/webservice.models';
import { IServiceParameterEntry } from '../models/service-parameter-entry.inteface';


@Component({
    selector: 'app-webservice-inputs-wiring',
    templateUrl: './webservice-inputs-wiring.component.html'
})
export class WebserviceInputsWiringComponent implements OnChanges {
    @Input() serviceOptions: ServiceNode[];
    @Input() currentNode: ServiceNode;
    parameterForm: FormGroup;


    constructor(private formBuilder: FormBuilder) { }

    ngOnChanges(): void {
        this.parameterForm = this.createForm();
    }

    createForm(): FormGroup {
        const formGroupData = this.createFormGroupData();
        return this.parameterForm = this.formBuilder.group(formGroupData);
    }

    createFormGroupData(): any {
        const formGroupData = {};
        for (const param of this.parameters) {
            formGroupData[param] = ['']
        }
        return formGroupData;
    }

    onSelect(entry: IServiceParameterEntry): void {
        this.parameterForm
            .setControl(entry.parameter, new FormControl(entry.id));
        this.currentNode.setIdToParam(entry);
    }

    get parameters(): string[] {
        return this.currentNode.parameters;
    }

}
