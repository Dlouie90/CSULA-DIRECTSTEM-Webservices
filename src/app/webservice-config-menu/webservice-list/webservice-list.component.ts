import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {IService} from '../../shared/models/service.interface';
import {NodeService} from '../../shared/services/node.service';


@Component({
  selector: 'app-webservice-list',
  templateUrl: './webservice-list.component.html',
})
export class WebserviceListComponent implements OnChanges, OnInit {
  @Input()
  serviceOptions: IService[];
  @Input()
  currentService: IService;
  @Output()
  onSelect = new EventEmitter<IService>();
  @Output()
  onRefresh = new EventEmitter<void>();
  selectedService: IService;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.selectedService = this.currentService;
  }

  isSelected(service: IService): boolean {
    if (!this.selectedService) {
      return false;
    }
    return this.selectedService.id === service.id;
  }

  onSelectService(service: IService): void {
    this.selectedService = service;
    this.onSelect.emit(service);
  }

  onRefreshService(): void {
    this.onRefresh.emit();
  }
}
