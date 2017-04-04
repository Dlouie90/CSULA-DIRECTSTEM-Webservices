import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectsComponent} from './projects.component';
import {ProjectFormComponent} from './project-form/project-form.component';
import {ProjectQuickViewComponent} from './project-quickview/project-quickview.component';
import {ProjectIntroComponent} from './project-intro/project-intro.component';

const routes: Routes = [
  {
    path     : 'project',
    component: ProjectsComponent,
    children : [
      {
        path: '',
        component: ProjectIntroComponent
      },
      {
        path     : 'quick/:id',
        component: ProjectQuickViewComponent,
      },
      {
        path     : 'form',
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
