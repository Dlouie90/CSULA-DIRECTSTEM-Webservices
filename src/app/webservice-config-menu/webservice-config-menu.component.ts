import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IService } from '../shared/models/service.interface';
import { NodeService } from '../shared/services/node.service';
import { Node } from '../shared/models/node.model';

@Component({
    selector: 'app-webservice-menu',
    templateUrl: './webservice-config-menu.component.html',
})
export class WebserviceConfigMenuComponent implements OnInit, OnChanges, OnDestroy {
    @Input() node: Node;
    @Input() inputNodes: Node[] = [];
    services: IService[];
    selectedService: IService;

    constructor(private nodeService: NodeService,
                public activeModal: NgbActiveModal) {
    }

    ngOnInit(): void {
        this.getServices();
        this.selectedService = this.node.service;
    }

    ngOnChanges(): void {
        this.selectedService = this.node.service;
    }

    ngOnDestroy(): void {
        this.nodeService.updateNodeToService(this.node);
    }

    private getServices(): void {
        this.nodeService.getServices()
            .subscribe(
                (services: IService[]) => {
                    this.services = services;
                },
                (error: any) => {
                    this.services = [];
                    console.error(error);
                }
            );
    }

    onSelectService(service: IService): void {
        this.selectedService = service;
        this.node.service = service;
        this.node.parameterEntries = [];
    }

    onClose(reason: string): void {
        this.activeModal.close(reason);
    }

    get isEmptyInputs(): boolean {
        return this.inputNodes.length === 0;
    }
}
