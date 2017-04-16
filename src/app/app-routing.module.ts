import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProjectsComponent} from './projects/projects.component';
import {DetailComponent} from './projects/detail/detail.component';
import {EditorComponent} from './projects/editor/editor.component';
import {DebugComponent} from './debug/debug.component';
import {VisualComponent} from './projects/visual/visual.component';

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
        path     : ':id/detail',
        component: DetailComponent,
      },
      {
        path     : ':id/visual',
        component: VisualComponent
      }
    ]
  },
  {
    path     : 'projects/:id/editor',
    component: EditorComponent,
    children : []
  },
  {
    path     : 'debug',
    component: DebugComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {
}
