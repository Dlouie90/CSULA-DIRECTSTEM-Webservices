import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileDetailComponent} from './profile-detail/profile-detail.component';

const routes: Routes = [
  {
    path     : 'profile/:id',
    component: ProfileDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class ProfileRoutingModule {
}
