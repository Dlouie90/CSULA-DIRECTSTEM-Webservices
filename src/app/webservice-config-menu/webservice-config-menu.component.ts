import {Component,
        Input,
        OnChanges,
        OnDestroy,
        OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {Node} from '../shared/models/node.model';
import {Project} from '../shared/models/project.model';
import {IService} from '../shared/models/service.interface';
import {NodeService} from '../shared/services/node.service';
import {ProjectService} from '../shared/services/project.service';

@Component({
  selector: 'app-webservice-menu',
  templateUrl: './webservice-config-menu.component.html',
})
export class WebserviceConfigMenuComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  project: Project;
  @Input()
  inputProjects: Project[] = [];
  services: IService[];
  selectedService: IService;

  constructor(private projectService: ProjectService, public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.getServices();
    this.selectedService = this.project.service;
  }

  ngOnChanges(): void {
    this.selectedService = this.project.service;
  }

  ngOnDestroy(): void {
    this.projectService.updateProjectToService(this.project);
  }

  private getServices(): void {
    this.projectService.getServices()
        .subscribe(
            (services: IService[]) => {
              this.services = services;
            },
            (error: any) => {
              this.services = [];
              console.error(error);
            });
  }

  onSelectService(service: IService): void {
    this.selectedService = service;
    this.project.service = service;
    this.project.parameterEntries = [];
  }

  onClose(reason: string): void {
    this.activeModal.close(reason);
  }

  get isEmptyInputs(): boolean {
    return this.inputProjects.length === 0;
  }
}
