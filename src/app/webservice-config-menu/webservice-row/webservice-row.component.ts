import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceNode } from '../models/webservice.models';
import { IServiceParameterEntry } from '../models/service-parameter-entry.inteface';

@Component({
    selector: 'app-webservice-row',
    templateUrl: './webservice-row.component.html',
    styleUrls: ['./webservice-row.component.css']
})
export class WebserviceRowComponent implements OnInit {
    @Input() serviceOptions: ServiceNode[];
    @Input() currentNode: ServiceNode;
    @Input() parameter: string;
    @Output() onSelect = new EventEmitter<IServiceParameterEntry>();
    selectedService: ServiceNode;


    constructor() { }

    ngOnInit(): void {
        this.updateSelectedService();
    }

    updateSelectedService(): void {
        const id = this.currentNode.getIdOfParam(this.parameter);
        this.selectedService = this.serviceOptions
            .find(service => service.id === id);
    }

    select(stringId: string): void {
        const numberId = parseInt(stringId, 10);
        this.selectedService = this.serviceOptions.find(service => {
            return service.id === numberId;
        });
        this.onSelect.emit({parameter: this.parameter, id: numberId});
    }

    isSelected(node: ServiceNode): boolean {
        return this.currentNode.paramsMap[this.parameter] === node.id;
    }
}

