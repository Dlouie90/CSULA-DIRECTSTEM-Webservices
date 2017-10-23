import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Node } from '../../shared/models/node.model';
import { ParameterEntry } from '../../shared/models/parameter-entry.inteface';

@Component({
    selector: 'app-composition-form',
    templateUrl: './composition-form.component.html'
})
export class CompositionFormComponent implements OnChanges {
    @Input() node: Node;
    nodeForm: FormGroup;
    paramGroup: FormGroup;


    constructor(private formBuilder: FormBuilder) {}

    ngOnChanges(): void {
        if (!this.node) { return; }

        this.nodeForm = this.createFormGroup(this.node);
        this.paramGroup = this.formBuilder.group({});
    }

    private createFormGroup(node: Node): FormGroup {
        return this.formBuilder.group({
            id: node.id,
            title: node.title,
            description: node.description,
            url: node.url,
            parameters: this.createParameterFormArray(node)
        });
    }

    private createParameterFormArray(node: Node): FormArray {
        const paramControlArray = node.parameterEntries
                .map((value: ParameterEntry) => this.formBuilder.group(value));
        return this.formBuilder.array(paramControlArray);
    }

    get parameters(): FormArray {
        return this.nodeForm.get('parameters') as FormArray;
    }

    addParameter(param: string): void {
        const defaultParameterEntry: ParameterEntry = {
            parameter: param,
            id: -1
        };
        this.parameters.push(this.formBuilder.group(defaultParameterEntry));
        this.node.setIdToParam(defaultParameterEntry);
    }
}
