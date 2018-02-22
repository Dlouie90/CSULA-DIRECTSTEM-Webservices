import {Component, EventEmitter, Output} from '@angular/core';
import {ProjectService} from '../../../../shared/services/project.service';
import {GetProjectByIdResponse} from '../../../../shared/models/server-response/get-project-by-id-response';

@Component({
    selector: 'app-project-by-id-form',
    templateUrl: './project-by-id-form.component.html'
})
export class ProjectByIdFormComponent {
    @Output()
    onGetProject = new EventEmitter<any>();

    constructor(private projectService: ProjectService) {
    }

    getProjectById(id: string): void {
        const idNumber = parseInt(id, 10);
        this.projectService.getProjectByIdDb(idNumber)
            .subscribe((res: GetProjectByIdResponse) => {
                if (res.success) {
                    const project = res.project;
                    console.log('project:', project);
                    this.onGetProject.emit(project);
                } else {
                    console.log(`Get project by id ${id} failed.`);
                }
            });
    }
}
