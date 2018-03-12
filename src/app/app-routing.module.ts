import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProjectsComponent} from './projects/projects.component';
import {DetailComponent} from './projects/detail/detail.component';
import {EditorComponent} from './projects/editor/editor.component';
import {DebugComponent} from './debug/debug.component';
import {AdminComponent} from './admin/admin.component';
import {AddUserComponent} from './admin/add-user/add-user.component';
import {EditUserComponent} from './admin/edit-user/edit-user.component';
import {UserSessionComponent} from './admin/user-session/user-session.component';
import {DetailUserComponent} from './admin/detail-user/detail-user.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'projects',
        component: ProjectsComponent,
    },
    {
        path: 'projects/:id/detail',
        component: DetailComponent
    },
    {
        path: 'projects/:id/editor',
        component: EditorComponent,
        children: []
    },
    {
        path: 'debug',
        component: DebugComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'detail',
        component: DetailUserComponent
    },
    {
        path: 'add',
        component: AddUserComponent
    },
    {
        path: 'edit/:id',
        component: EditUserComponent
    },
    {
        path: 'admin/user-session',
        component: UserSessionComponent
    },
    {
        path: '**',
        component: HomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],

    exports: [RouterModule],
})
export class AppRoutingModule {
}
