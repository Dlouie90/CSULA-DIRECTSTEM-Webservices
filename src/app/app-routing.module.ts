import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProjectsComponent} from './projects/projects.component';
import {DetailComponent} from './projects/detail/detail.component';
import {EditorComponent} from './editor/editor.component';

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
    component: ProjectsComponent,
    children : [
      {
        path     : 'detail/:id',
        component: DetailComponent,
      },
    ]
  },
  {
    path     : 'editor/:id',
    component: EditorComponent,
    children : []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {
}
