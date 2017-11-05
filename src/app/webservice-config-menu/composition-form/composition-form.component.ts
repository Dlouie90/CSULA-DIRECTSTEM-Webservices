import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Node } from '../../shared/models/node.model';
import { NodeService } from '../../shared/services/node.service';

@Component({
    selector: 'app-composition-form',
    templateUrl: './composition-form.component.html'
})
export class CompositionFormComponent implements OnChanges, OnDestroy {
    @Input() node: Node;
    nodeForm: FormGroup;
    paramGroup: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private nodeService: NodeService) {}

    ngOnChanges(): void {
        if (!this.node) { return; }

        this.nodeForm = this.createFormGroup(this.node);
        this.paramGroup = this.formBuilder.group({});
    }

    ngOnDestroy(): void {
        this.saveChange();
    }

    private createFormGroup(node: Node): FormGroup {
        return this.formBuilder.group({
            id: node.id,
            title: node.title,
            description: node.description,
            url: node.url,
            parameters: this.createParameterFormArray(node),
            demoInputs: this.createDemoInputsFormsArray(node.parameters)
        });
    }

    private createParameterFormArray(node: Node): FormArray {
        const paramControlArray = node
            .parameters
            .map((param: string) => this.formBuilder.control(param));
        return this.formBuilder.array(paramControlArray);
    }

    get parameters(): FormArray {
        return this.nodeForm.get('parameters') as FormArray;
    }

    private createDemoInputsFormsArray(parameters: string[]): FormArray {
        const inputs = parameters
            .map(_ => this.formBuilder.control(''));
        return this.formBuilder.array(inputs);
    }

    get demoInputs(): FormArray {
        return this.nodeForm.get('demoInputs') as FormArray;
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
        this.node.parameters.push(param);
    }

    saveChange(): void {
        this.node.title = this.nodeForm.get('title').value;
        this.node.description = this.nodeForm.get('description').value;
        this.nodeService.updateNodeToService(this.node);
    }
}
