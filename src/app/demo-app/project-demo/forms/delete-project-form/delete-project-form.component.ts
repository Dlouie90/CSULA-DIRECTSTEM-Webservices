import {
    Component,
    EventEmitter,
    Output
} from '@angular/core';
import {ProjectService} from '../../../../shared/services/project.service';

@Component({
    selector: 'app-delete-project-form',
    templateUrl: './delete-project-form.component.html'
})
export class DeleteProjectFormComponent {
    @Output()
    onDeleteProject = new EventEmitter<any>();

    constructor(private projectService: ProjectService) {
    }

    deleteProject(id: string): void {
        const numberId = parseInt(id, 10);
        this.projectService.deleteProjectById(numberId)
            .subscribe((result: any) => this.onDeleteProject)
    }
}
