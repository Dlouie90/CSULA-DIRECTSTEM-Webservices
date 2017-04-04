import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectsComponent} from './projects.component';
import {ProjectDetailComponent} from './project-detail/project-detail.component';
import {ProjectFormComponent} from './project-form/project-form.component';

const routes: Routes = [
  {
    path     : 'project',
    component: ProjectsComponent,
    children : [
      {
        path     : 'detail/:id',
        component: ProjectDetailComponent,
      },
      {
        path: 'form',
        component: ProjectFormComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
