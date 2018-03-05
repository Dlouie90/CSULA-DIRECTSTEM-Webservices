import {
    Component,
    EventEmitter,
    Output
} from '@angular/core';
import {ProjectService} from '../../../../shared/services/project.service';
import {Project} from '../../../../shared/models/project.model';


@Component({
    selector: 'app-create-project-form',
    templateUrl: './create-project-forms.component.html',
})
export class CreateProjectFormsComponent {
    @Output()
    onCreate = new EventEmitter<any>();

    constructor(private projectService: ProjectService) {

    }

    createProject(): void {
        this.projectService.createNew();

        this.projectService.getProjectsDb().subscribe((result: Project[]) => this.onCreate.emit(result));
    }
}
