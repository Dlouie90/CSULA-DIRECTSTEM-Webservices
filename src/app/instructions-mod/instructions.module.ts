import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {InstructionsRoutingModule} from './instructions-routing.module';
import {InstructionsComponent} from './instructions.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    InstructionsRoutingModule
  ],

  declarations: [
    InstructionsComponent,
  ]
})
export class InstructionsModule {
}