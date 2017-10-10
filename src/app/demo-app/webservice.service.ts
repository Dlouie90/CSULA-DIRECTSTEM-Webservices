import { Injectable } from '@angular/core';
import { serviceArray } from './webservice-mock-data';

@Injectable()
export class WebserviceService {
    private _services: any[] = serviceArray;

    get simpleService(): any {
        return this._services[0];
    }

    get compositeService(): any {
        return this._services[1];
    }

    get services(): any[] {
        return this._services;
    }
}
