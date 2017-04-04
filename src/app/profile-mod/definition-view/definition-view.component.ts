import {Component, Input, OnInit} from '@angular/core';
import {Webservice} from '../../projects-mod/shared/webservice.model';

@Component({
  selector   : 'app-definition-view',
  templateUrl: './definition-view.component.html',
  styleUrls  : ['./definition-view.component.css']
})
export class DefinitionViewComponent implements OnInit {

  @Input()
  webservice: Webservice;

  constructor(){
  }

  ngOnInit(): void {
  }
}
