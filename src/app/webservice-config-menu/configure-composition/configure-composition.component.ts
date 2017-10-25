import { Component, Input } from '@angular/core';
import { Node } from '../../shared/models/node.model';

@Component({
    selector: 'app-configure-composition',
    templateUrl: './configure-composition.component.html',
    styleUrls: ['./configure-composition.component.css']
})
export class ConfigureCompositionComponent {
    @Input() node: Node;
    @Input() inputNodes: Node[];
    selectedNode: Node;

    /* TODO: Implement onChange */
    onChange(value: any): void { }
}

