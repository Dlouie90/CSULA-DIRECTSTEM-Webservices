import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Node } from '../../shared/models/node.model';


@Component({
    selector: 'app-webservice-list',
    templateUrl: './webservice-list.component.html',
})
export class WebserviceListComponent {
    @Input() nodeOptions: Node[];
    @Input() currentNode: Node;
    @Output() onSelect = new EventEmitter<Node>();
    @Output() onRefresh = new EventEmitter<void>();


    constructor() {}

    isSelected(node: Node): boolean {
        if (!this.currentNode) { return false; }
        return this.currentNode.serviceId === node.serviceId;
    }

    onSelectNode(node: Node): void {
        this.onSelect.emit(node);
    }

    onRefreshService(): void {
        this.onRefresh.emit();
    }

}

