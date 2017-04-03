import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProjectsComponent} from './projects/projects.component';
import {InstructionsComponent} from './instructions/instructions.component';

const routes: Routes = [
  {
    path     : 'home',
    component: HomeComponent
  },
  {
    path      : '',
    redirectTo: 'home',
    pathMatch : 'full'
  },
  {
    path     : 'projects',
    component: ProjectsComponent
  },
  {
    path: 'instructions',
    component: InstructionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {
}
