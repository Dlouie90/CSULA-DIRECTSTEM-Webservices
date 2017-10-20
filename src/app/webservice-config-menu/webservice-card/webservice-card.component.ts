import { Component, Input } from '@angular/core';
import { Node } from '../../shared/models/node.model';


@Component({
    selector: 'app-webservice-card',
    templateUrl: './webservice-card.component.html'
})
export class WebserviceCardComponent {
    @Input() node: Node;
    @Input() selected: boolean;


    constructor() {}

    get title(): string {
        return (this.node && this.node.serviceTitle ) || '';
    }

    get id(): string {
        return (this.node && this.node.serviceId.toString()) || '';
    }

    get description(): string {
        return (this.node && this.node.serviceDescription) || '';
    }

    get url(): string {
        return (this.node && this.node.serviceUrl) || '';
    }

    get parameters(): string {
        if (!this.node) {
            return '';
        }
        return this.node.serviceParameters.join(', ');
    }

    get selectedStyles(): any {
        return {'text-white': this.selected, 'bg-success': this.selected}
    }

    get subtitleStyle(): any {
        return {'text-muted': !this.selected, 'text-light': this.selected};
    }
}


