import {Project} from '../project.model';

export class GetProjectByIdResponse {
    id: number;
    project: Project;
    success: boolean;
}