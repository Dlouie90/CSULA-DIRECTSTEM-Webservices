import { Component, Input } from '@angular/core';
import { ServiceNode } from '../models/webservice.models';

@Component({
    selector: 'app-webservice-card',
    templateUrl: './webservice-card.component.html'
})
export class WebserviceCardComponent {
    @Input() serviceNode: ServiceNode;
    @Input() selected: boolean;


    constructor() {}

    get title(): string {
        return (this.serviceNode && this.serviceNode.title ) || '';
    }

    get id(): string {
        return (this.serviceNode && this.serviceNode.id.toString()) || '';
    }

    get description(): string {
        return (this.serviceNode && this.serviceNode.description) || '';
    }

    get url(): string {
        return (this.serviceNode && this.serviceNode.url) || '';
    }

    get parameters(): string {
        if (!this.serviceNode) {
            return '';
        }
        return this.serviceNode.parameters.join(', ');
    }

    get selectedStyles(): any {
        return {'text-white': this.selected, 'bg-success': this.selected}
    }

    get subtitleStyle(): any {
        return {'text-muted': !this.selected, 'text-light': this.selected};
    }
}


