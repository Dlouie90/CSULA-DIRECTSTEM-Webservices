import * as _ from 'lodash';
import { IServiceParameterMap } from './service-parameter-map.interface';
import { IService } from './service.interface';
import { IServiceParameterEntry } from './service-parameter-entry.inteface';

export class ServiceNode {
    paramsMap: IServiceParameterMap;

    static createDefaultParamMap(params: string[]): IServiceParameterMap {
        const obj = {};
        for (let param of params) {
            obj[param] = -1;
        }
        return obj;
    }

    constructor(public service: IService) {
        this.paramsMap =
            ServiceNode.createDefaultParamMap(this.parameters);
    }


    get id(): number {
        return this.service.id;
    }

    get title(): string {
        return this.service.title;
    }

    get description(): string {
        return this.service.description;
    }

    get url(): string {
        return this.service.url;
    }

    get parameters(): string[] {
        return this.service.parameters || [];
    }

    get isEveryParamAssigned(): boolean {
        return _.values(this.paramsMap)
            .every(id => id !== -1);
    }

    getIdOfParam(param: string): number {
        if (!this.paramsMap[param]) { return -1; }
        return this.paramsMap[param];
    }

    setIdToParam(entry: IServiceParameterEntry): void {
        this.paramsMap[entry.parameter] = entry.id;
    }
}
