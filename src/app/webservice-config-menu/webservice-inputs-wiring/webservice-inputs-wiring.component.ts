import { Component, Input, OnChanges } from '@angular/core';
import { IService } from '../../shared/models/service.interface';
import { Node } from '../../shared/models/node.model';

@Component({
    selector: 'app-webservice-inputs-wiring',
    templateUrl: './webservice-inputs-wiring.component.html'
})
export class WebserviceInputsWiringComponent implements OnChanges {
    @Input() node: Node;
    @Input() service: IService;

    constructor() { }

    ngOnChanges(): void { }

    get parameters(): string[] {
        return this.service.parameters;
    }
}
