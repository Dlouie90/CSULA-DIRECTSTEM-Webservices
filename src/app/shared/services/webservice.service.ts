import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash'
import 'rxjs/add/operator/map'
import { IService } from '../../webservice-config-menu/models/service.interface';

@Injectable()
export class WebserviceService {
    private baseUrl = 'http://localhost:8080/webservice/rest';

    static sortServicesById(services: IService[]): IService[] {
        return _.sortBy(services, ['id']);
    }

    constructor(private http: Http) { }

    getServices(): Observable<IService[]> {
        const url = `${this.baseUrl}/comp/listservices`;
        return this.http.get(url)
            .map((response: Response) => {
                const services = response.json().result as IService[];
                return WebserviceService.sortServicesById(services);
            });
    }

    // delete all excepts for the "defaults"  services (add, mod, etc...)
    deleteAllServices() {
        const url = `${ this.baseUrl }/comp/bulkdel`;
        this.http.post(url, {})
            .subscribe(
                (response: Response) => response,
                (error: any) => error
            );
    }
}
