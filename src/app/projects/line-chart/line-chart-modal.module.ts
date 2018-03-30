import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbActiveModal,
        NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {LineChartComponent} from './line-chart.component';
import {EditorComponent} from '../editor/editor.component';

@NgModule({
  declarations: [
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  exports: [],
  providers: [
    NgbActiveModal,
  ],
  entryComponents: [
    LineChartComponent,
  ],
})
export class LineChartModalModule {}
