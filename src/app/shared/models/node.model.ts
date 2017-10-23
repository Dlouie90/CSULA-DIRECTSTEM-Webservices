import { IService } from './service.interface';
import { IParameterMap } from './parameter-map.interface';
import { ParameterEntry } from './parameter-entry.inteface';

export class Node {
    nodeTitle: string;
    description: string;
    url: string;
    service: IService;

    parameterMap: IParameterMap = {};
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

    createDefaultParameterMap(): void {
        const obj = {};
        if (this.service) {
            for (const param of this.serviceParameters) {
                obj[param] = -1;
            }
        }
        this.parameterMap = obj;
    }

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

    getIdOfParam(param: string): number {
        if (!this.parameterMap[param]) { return -1; }
        return this.parameterMap[param];
    }

    setIdToParam(entry: ParameterEntry): void {
        if (!this.parameterMap) {
            this.parameterMap = {};
        }

        this.parameterMap[entry.parameter] = entry.id;
    }

    get parameterEntries(): ParameterEntry[] {
        const array = [];
        for (const key in this.parameterMap) {
            if (this.parameterMap.hasOwnProperty(key)) {
                array.push({parameter: key, id: this.parameterMap[key]})
            }
        }
        return array;
    }
}
