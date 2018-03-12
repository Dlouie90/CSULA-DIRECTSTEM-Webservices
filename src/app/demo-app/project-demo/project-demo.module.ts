import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {ProjectDemoComponent} from './project-demo.component';
import {GetAllProjectsComponent} from './forms/get-all-projects/get-all-projects.component';
import {CreateProjectFormsComponent} from './forms/create-project-form/create-project-forms.component';
import {DeleteProjectFormComponent} from './forms/delete-project-form/delete-project-form.component';
import {UpdateProjectFormComponent} from './forms/update-project-form/update-project-form.component';
import {ProjectByIdFormComponent} from './forms/project-by-id-form/project-by-id-form.component';

@NgModule({
    declarations: [ProjectDemoComponent,
        GetAllProjectsComponent,
        CreateProjectFormsComponent,
        DeleteProjectFormComponent,
        UpdateProjectFormComponent,
        ProjectByIdFormComponent
    ],
    imports: [NgbModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpModule],
    exports: [ProjectDemoComponent],
    providers: [],
})
export class ProjectDemoModule {
}
