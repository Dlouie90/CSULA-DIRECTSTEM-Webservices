import { IService } from './service.interface';
import { ParameterEntry } from './parameter-entry.model';

export class Node {
    title: string;
    description: string;
    url: string;
    service: IService;
    parameters: string[] = [];
    parameterEntries: ParameterEntry[] = [];
    neighbors: Node[] = [];
    children: Node[] = [];
    inputs: Node[] = [];
    outputs: Node[] = [];
    inputEntries: InputEntry[] = [];

    /** Return true if the node is neither a input or output node. */
    static isRegular(node) {
        return !(node.isInput || node.isOutput);
    }

    static create(id: number) {
        return new Node(id, 300, 100);
    }

    constructor(public id: number,
                public x: number,
                public y: number) {
        this.title = `NODE_${ id }`;
    }
}

/** Map a parameter to a "Node". This mean that the output, result, of the
 * node should be feed to the "parameter" */
export class InputEntry {
    fromNode: Node;
    toParameter: string;
}
