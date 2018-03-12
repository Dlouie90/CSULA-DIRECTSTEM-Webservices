import {ParameterEntry} from './parameter-entry.model';
import {IService} from './service.interface';
import {Node} from './node.model';
import {Edge} from './edge.model';

export class Project {
    dbId: number;
    title: string;
    description: string;
    url: string;
    service: IService;
    parameters: string[] = [];
    parameterEntries: ParameterEntry[] = [];
    headNode: Node;
    nodes: Node[] = [];
    edges: Edge[] = [];
    stats;

    static create(id: number) {
        return new Project(id);
    }

    static projectTitle(project: Project): string {
        return project.title || `PROJECT_${project.id}`
    }

    constructor(public id: number) {
        this.title = `PROJECT_${id}`;
        this.stats = [];
    }
}
