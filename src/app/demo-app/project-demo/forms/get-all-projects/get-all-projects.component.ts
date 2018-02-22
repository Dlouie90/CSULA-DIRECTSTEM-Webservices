import {
    Component,
    EventEmitter,
    Output
} from '@angular/core';

import {Project} from '../../../../shared/models/project.model';
import {ProjectService} from '../../../../shared/services/project.service';

@Component({
    selector: 'app-get-all-projects',
    templateUrl: './get-all-projects.component.html',
})
export class GetAllProjectsComponent {
    @Output()
    onGetAllProject = new EventEmitter<any>();

    constructor(private projectService: ProjectService) {
    }

    getProjects(): void {
        this.projectService.getProjectsDb().subscribe((result: Project[]) => this.onGetAllProject.emit(result))
    }
}
