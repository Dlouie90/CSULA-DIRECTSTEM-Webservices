import {Component, EventEmitter, Output} from '@angular/core';
import {ProjectService} from '../../../../shared/services/project.service';
import {ProjectResponse} from '../../../../shared/models/server-response/project-response';

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
            .subscribe((res: ProjectResponse) => {
                if (res.success) {
                    const project = JSON.parse(res.data);
                    console.log('project:', project);
                    this.onGetProject.emit(project);
                } else {
                    console.log(`Get project by id ${id} failed.`);
                }
            });
    }
}
