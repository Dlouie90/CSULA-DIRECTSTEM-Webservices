import {NgModule} from '@angular/core';
import {Route,
        RouterModule} from '@angular/router';
import {DemoAppComponent} from './demo-app.component';

const routes: Route[] = [
  {
    path: 'demo',
    component: DemoAppComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoAppRoutingModule {
}
