import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Node } from '../../shared/models/node.model';
import { ParameterEntry } from '../../shared/models/parameter-entry.inteface';

@Component({
    selector: 'app-webservice-row',
    templateUrl: './webservice-row.component.html',
    styleUrls: ['./webservice-row.component.css']
})
export class WebserviceRowComponent implements OnInit {
    @Input() nodeOptions: Node[];
    @Input() currentNode: Node;
    @Input() parameter: string;
    @Output() onSelect = new EventEmitter<ParameterEntry>();

    selectedNode: Node;


    constructor() { }

    ngOnInit(): void {
        this.updateSelectedService();
    }

    updateSelectedService(): void {
        const id = this.currentNode.getIdOfParam(this.parameter);
        this.selectedNode = this.nodeOptions
            .find(service => service.id === id);
    }

    isSelected(node: Node): boolean {
        return this.currentNode.parameterMap[this.parameter] === node.id;
    }

    onSelectId(stringId: string): void {
        const numberId = parseInt(stringId, 10);
        this.selectedNode = this.nodeOptions.find(node => {
            return node.serviceId === numberId;
        });
        this.onSelect.emit({parameter: this.parameter, id: numberId});
    }
}

