import { IService } from './service.interface';
import { ParameterEntry } from './parameter-entry.model';

export class Node {
    nodeTitle: string;
    description: string;
    url: string;
    service: IService;
    parameters: string[] = [];
    parameterEntries: ParameterEntry[] = [];
    neighbors: Node[] = [];
    children: Node[] = [];
    inputs: Node[] = [];
    outputs: Node[] = [];

    /** Return true if the node is neither a input or output node. */
    static isRegular(node) {
        return !(node.isInput || node.isOutput);
    }

    static create(id: number) {
        return new Node(id, 300, 100);
    }

    constructor(public id: number,
                public x: number,
                public y: number) {}


    get title(): string {
        return this.nodeTitle ? this.nodeTitle : `ID-${ this.id }`;
    }

    get serviceId(): number {
        return this.service.id;
    }

    get serviceTitle(): string {
        return this.service.title;
    }

    get serviceDescription(): string {
        return this.service.description;
    }

    get serviceUrl(): string {
        return this.service.url;
    }

    get serviceParameters(): string[] {
        return (this.service && this.service.parameters) || [];
    }
}
