import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParameterEntry } from '../../shared/models/parameter-entry.inteface';
import { IService } from '../../shared/models/service.interface';

@Component({
    selector: 'app-webservice-row',
    templateUrl: './webservice-row.component.html',
    styleUrls: ['./webservice-row.component.css']
})
export class WebserviceRowComponent implements OnInit {
    @Input() serviceOptions: IService[] = [];
    @Input() parameter: string;
    @Input() currentService: IService;
    @Output() onSelect = new EventEmitter<ParameterEntry>();

    selectedService: IService;
    constructor() { }

    ngOnInit(): void {
        this.updateSelectedService();
    }

    updateSelectedService(): void {
        const id = this.currentService.id;
        this.selectedService = this.serviceOptions
            .find(service => service.id === id);
    }

    isSelected(service: IService): boolean {
        return this.currentService.id === service.id;
    }

    onSelectId(stringId: string): void {
        const numberId = parseInt(stringId, 10);
        this.selectedService = this.serviceOptions.find(service => {
            return service.id === numberId;
        });
        this.onSelect.emit({parameter: this.parameter, id: numberId});
    }
}

