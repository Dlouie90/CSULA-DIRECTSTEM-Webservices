import { Component } from '@angular/core';
import { NodeService } from '../shared/services/node.service';
import { IService } from '../shared/models/service.interface';

@Component({
    selector: 'app-service-list',
    templateUrl: './service-list.component.html'
})
export class ServiceListComponent {
    services: IService[];

    constructor(private nodeService: NodeService) {}

    getServices(): void {
        this.nodeService
            .getServices()
            .subscribe((result: IService[]) => {
                console.log('getService() successful');
                this.services = result;
            })
    }

    resetService(): void {
        this.nodeService
            .resetService()
            .subscribe((() => console.log('resetService() successful')));
    }
}

