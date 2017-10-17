import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceNode } from '../models/webservice.models';

@Component({
    selector: 'app-webservice-list',
    templateUrl: './webservice-list.component.html',
})
export class WebserviceListComponent {
    @Input() serviceOptions: ServiceNode[];
    @Input() currentNode: ServiceNode;
    @Output() onSelect = new EventEmitter<ServiceNode>();
    @Output() onRefresh = new EventEmitter<void>();


    constructor() {}

    select(node: ServiceNode): void {
        this.onSelect.emit(node);
    }

    refreshServices(): void {
        this.onRefresh.emit();
    }

    isSelected(node: ServiceNode): boolean {
        if (!this.currentNode) { return false; }
        return this.currentNode.id === node.id;
    }
}

