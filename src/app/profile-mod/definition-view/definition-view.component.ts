import {Component, Input, OnInit} from '@angular/core';
import {Webservice} from '../../shared/webservice.model';
import {Location} from '@angular/common';

@Component({
  selector   : 'app-definition-view',
  templateUrl: './definition-view.component.html',
  styleUrls  : ['./definition-view.component.css']
})
export class DefinitionViewComponent implements OnInit {

  @Input()
  webservice: Webservice;

  constructor(private location: Location) {
  }

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }
}
