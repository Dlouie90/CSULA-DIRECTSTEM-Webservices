import {Injectable, OnInit} from '@angular/core';
import {Webservice} from './webservice.model';
import {DATA} from './webservice-mock.data';

@Injectable()
export class WebserviceService implements OnInit {

  private webservices: Webservice[];

  constructor() {
    this.webservices = [].concat(DATA);
  }

  ngOnInit(): void {
  }

  add(webservice: Webservice): void {
    this.webservices.push(webservice);
  }

  getWebservices(): Promise<Webservice[]> {
    return Promise.resolve(this.webservices);
  }

  getWebservice(id: number): Promise<Webservice> {
    return this.getWebservices()
        .then((wss: Webservice[]) => wss.find((ws: Webservice) => ws.id === id));
  }
}
