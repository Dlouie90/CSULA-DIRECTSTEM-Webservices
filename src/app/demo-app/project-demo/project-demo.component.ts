import {Component} from '@angular/core';
import {FormBuilder,
    FormGroup} from '@angular/forms';

@Component({
    selector: 'app-project-demo',
    templateUrl: './project-demo.component.html'
})
export class ProjectDemoComponent {
    requestResult: any = {};
    createProjectForm: FormGroup;
    updateProjectForm: FormGroup;
    index = 1;

    constructor(private formBuilder: FormBuilder) {
        this.createProjectForm = formBuilder.group({
            id: [''],
            title: [''],
            description: [''],
        });

        this.updateProjectForm = formBuilder.group({
            title: [''],
            lastName: ['']
        });
    }

    onResult(result): void {
        this.requestResult = result;
    }
}