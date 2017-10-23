import { Component, Input } from '@angular/core';
import { IService } from '../../shared/models/service.interface';


@Component({
    selector: 'app-webservice-card',
    templateUrl: './webservice-card.component.html'
})
export class WebserviceCardComponent {
    @Input() service: IService;
    @Input() selected: boolean;

    constructor() {}

    get title(): string {
        return (this.service && this.service.title) || '';
    }

    get id(): number {
        return (this.service && this.service.id) || null;
    }

    get description(): string {
        return (this.service && this.service.description) || '';
    }

    get url(): string {
        return (this.service && this.service.url) || '';
    }

    get parameters(): string {
        if (!this.service) {
            return '';
        }
        return this.service.parameters.join(', ');
    }

    get selectedStyles(): any {
        return {'text-white': this.selected, 'bg-success': this.selected}
    }

    get subtitleStyle(): any {
        return {'text-muted': !this.selected, 'text-light': this.selected};
    }
}


