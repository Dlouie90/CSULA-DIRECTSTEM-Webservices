import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InstructionsComponent} from './instructions.component';

const routes: Routes = [
  {
    path     : 'instruction',
    component: InstructionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructionsRoutingModule {

}
