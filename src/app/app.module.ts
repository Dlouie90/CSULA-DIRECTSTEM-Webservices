import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {MainNavComponent} from './main-nav/main-nav.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {CarouselComponent} from './home/carousel/carousel.component';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './footer/footer.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProjectsComponent} from './projects/projects.component';
import {DetailComponent} from './projects/detail/detail.component';
import {NodeService} from './shared/node.service';
import {AccordionComponent} from './projects/detail/accordion/accordion.component';
import {PropertyTableComponent} from './projects/detail/property-table/property-table.component';
import {EditorComponent} from './projects/editor/editor.component';
import {NodeQuickviewComponent} from './main-nav/node-quickview/node-quickview.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {QuickEditComponent} from './projects/editor/quick-edit/quick-edit.component';
import {BreadcrumbComponent} from './projects/editor/breadcrumb/breadcrumb.component';
import {DebugComponent} from './debug/debug.component';
import {VisualComponent} from './projects/visual/visual.component';
import {CollapsibleTreeComponent} from './projects/collapsible-tree/collapsible-tree.component';
import {BarChartComponent} from './projects/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    CarouselComponent,
    FooterComponent,
    DashboardComponent,
    ProjectsComponent,
    DetailComponent,
    AccordionComponent,
    PropertyTableComponent,
    EditorComponent,
    NodeQuickviewComponent,
    QuickEditComponent,
    BreadcrumbComponent,
    DebugComponent,
    VisualComponent,
    CollapsibleTreeComponent,
    BarChartComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule.forRoot(),
    AppRoutingModule,
  ],

  providers: [NodeService],

  bootstrap: [AppComponent]
})
export class AppModule {
}
