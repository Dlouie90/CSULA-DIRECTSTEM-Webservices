import {Component} from '@angular/core';

import {IService} from '../shared/models/service.interface';
//import {NodeService} from '../shared/services/node.service';
import {ProjectService} from '../shared/services/project.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html'
})
export class ServiceListComponent {
  services: IService[];

  constructor(private projectService: ProjectService) {}

  getServices(): void{
      /*
      this.nodeService
          .getServices()
          .subscribe((result: IService[]) => {
            console.log('getService() successful');
            this.services = result;
          });
      */
      this.projectService
          .getServices()
          .subscribe((result: IService[]) => {
            console.log('getService() successful');
            this.services = result;
          });
  }

  resetService(): void {
    /*
    this.nodeService
        .resetService()
        .subscribe((() => console.log('resetService() successful')));
    */
    this.projectService
        .resetService()
        .subscribe(() => console.log('resetService() successful'));
  }
}
