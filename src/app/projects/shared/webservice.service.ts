import {Injectable, OnInit} from '@angular/core';
import {Webservice} from './webservice.model';
import {DATA} from './webservice-mock.data';

@Injectable()
export class WebserviceService implements OnInit {

  private _webservices: Webservice[];

  constructor() {
    this._webservices = [].concat(DATA);
  }

  ngOnInit(): void {
  }

  add(webservice: Webservice): void {
    this._webservices.push(webservice);
  }

  get webservices(): Webservice[] {
    return this._webservices;
  }
}
