import {Component, Input, OnInit} from '@angular/core';
import {Property} from '../../../shared/property.model';

@Component({
  selector   : 'app-property-table',
  templateUrl: './property-table.component.html',
  styleUrls  : ['./property-table.component.css']
})
export class PropertyTableComponent implements OnInit {
  @Input()
  properties: Array<Property>;

  constructor() {
  }

  ngOnInit() {
  }

}
