import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ParameterEntry } from '../../shared/models/parameter-entry.inteface';
import { IService } from '../../shared/models/service.interface';

@Component({
    selector: 'app-webservice-inputs-wiring',
    templateUrl: './webservice-inputs-wiring.component.html'
})
export class WebserviceInputsWiringComponent implements OnChanges {
    @Input() serviceOptions: IService[] = [];
    @Input() service: IService;
    parameterForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnChanges(): void {
        this.parameterForm = this.createForm();
    }

    private createForm(): FormGroup {
        const formGroupData = this.createFormGroupData();
        return this.parameterForm = this.formBuilder.group(formGroupData);
    }

    private createFormGroupData(): any {
        const formGroupData = {};
        for (const param of this.parameters) {
            formGroupData[param] = ['']
        }
        return formGroupData;
    }

    onSelect(entry: ParameterEntry): void {
        this.parameterForm
            .setControl(entry.parameter, new FormControl(entry.id));
    }

    get parameters(): string[] {
        return this.service.parameters;
    }
}
