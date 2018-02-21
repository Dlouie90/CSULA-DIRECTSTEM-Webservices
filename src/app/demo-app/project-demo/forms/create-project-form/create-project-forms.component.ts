import {
    Component,
    EventEmitter,
    Output
} from '@angular/core';
import {
    FormBuilder,
    FormGroup
} from '@angular/forms';
import {ProjectService} from '../../../../shared/services/project.service';
import {CreateProjectResponse} from '../../../../shared/models/server-response/create-project-response.model';

@Component({
    selector: 'app-create-project-form',
    templateUrl: './create-project-forms.component.html',
})
export class CreateProjectFormsComponent {
    @Output()
    onCreate = new EventEmitter<any>();
    newProjectForm: FormGroup;

    constructor(private projectService: ProjectService, private formBuilder: FormBuilder) {
        this.newProjectForm = formBuilder.group({
            title: '',
            description: '',
        });
    }

    createProject(): void {
        this.projectService.createProjectDb(this.newProjectForm.value)
            .subscribe(
                (res: CreateProjectResponse) => this.onCreate.emit(res),
                (err: any) => this.onCreate.emit(err),
                () => this.newProjectForm.reset());
    }
}
