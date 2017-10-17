import { Component, OnInit } from '@angular/core';
import { WebserviceService } from '../shared/services/webservice.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceNode } from './models/webservice.models';
import { IService } from './models/service.interface';


@Component({
    selector: 'app-webservice-menu',
    templateUrl: './webservice-config-menu.component.html',
})
export class WebserviceConfigMenuComponent implements OnInit {
    serviceNodes: ServiceNode[];
    selectedNode: ServiceNode;

    constructor(private webserviceService: WebserviceService,
                public activeModal: NgbActiveModal) {}

    ngOnInit(): void {
        this.getServices();
    }

    getServices(): void {
        this.webserviceService.getServices()
            .subscribe(
                (results: IService[]) => {
                    this.serviceNodes = this.toServiceNodes(results);
                },
                (error: any) => {
                    this.serviceNodes = [];
                    console.error(error);
                }
            );
    }

    onSelectService(serviceNode: ServiceNode): void {
        this.selectedNode = serviceNode;
    }

    private toServiceNodes(services: IService[]): ServiceNode [] {
        return services.map(service => new ServiceNode(service));
    }

    close(reason: string): void {
        this.activeModal.close(reason);
    }

}
