import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IService } from '../shared/models/service.interface';
import { NodeService } from '../shared/services/node.service';
import { Node } from '../shared/models/node.model';

@Component({
    selector: 'app-webservice-menu',
    templateUrl: './webservice-config-menu.component.html',
})
export class WebserviceConfigMenuComponent implements OnInit {
    nodes: Node[];
    selectedNode: Node;


    constructor(private nodeService: NodeService,
                public activeModal: NgbActiveModal) {}

    ngOnInit(): void {
        this.getServices();
    }

    private getServices(): void {
        this.nodeService.getServices()
            .subscribe(
                (services: IService[]) => {
                    this.nodes = this.toNodes(services);
                },
                (error: any) => {
                    this.nodes = [];
                    console.error(error);
                }
            );
    }

    private toNodes(services: IService[]): Node[] {
        return services.map(service => {
            const id = NodeService.generateTempId();
            return new Node(id, 300, 300, service);
        });
    }

    onSelectService(selectedNode: Node): void {
        this.selectedNode = selectedNode;
    }

    onClose(reason: string): void {
        this.activeModal.close(reason);
    }
}
