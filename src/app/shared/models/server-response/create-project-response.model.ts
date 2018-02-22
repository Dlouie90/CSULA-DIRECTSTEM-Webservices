import {Project} from '../project.model';

export class CreateProjectResponse {
    constructor(public project: Project, public successful: boolean) {
    }
}
