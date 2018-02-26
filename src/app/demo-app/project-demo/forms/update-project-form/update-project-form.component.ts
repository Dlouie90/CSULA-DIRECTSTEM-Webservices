import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProjectService} from '../../../../shared/services/project.service';

@Component({
    selector: 'app-update-project-form',
    templateUrl: './update-project-form.component.html',
})
export class UpdateProjectFormComponent {
    @Output()
    onUpdate = new EventEmitter<any>();
    updateForm: FormGroup;

    constructor(private projectService: ProjectService, private formBuilder: FormBuilder) {
        this.updateForm = formBuilder.group({
            id: '',
            data: '',
        })
    }

    updateProject(): void {
        const project = this.updateForm.value;
        const id = project.id;
        this.projectService
            .updateProjectById(id, project)
            .subscribe((result: any) => {
                this.updateForm.reset();
                this.onUpdate.emit(result)
            });
    }
}
