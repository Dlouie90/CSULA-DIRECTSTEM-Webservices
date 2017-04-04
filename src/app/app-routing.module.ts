import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {InstructionsComponent} from './instructions-mod/instructions.component';

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
    path     : 'instructions',
    component: InstructionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {
}
