import {Injectable, OnInit} from '@angular/core';
import {Webservice} from './webservice.model';
import {DATA} from './webservice-mock.data';

@Injectable()
export class WebserviceService implements OnInit {
  private webservices: Webservice[];
  private counter: number;

  constructor() {
    this.webservices = [].concat(DATA);
    this.counter     = 2;
  }

  ngOnInit(): void {
  }

  add(args: any): void {
    const ws = new Webservice(
        this.nextCount(), args.title, args.description, args.type);
    this.webservices.push(ws);
  }

  nextCount(): number {
    return this.counter++;
  }

  getWebservices(): Promise<Webservice[]> {
    return Promise.resolve(this.webservices);
  }

  getWebservice(id: number): Promise<Webservice> {
    return this.getWebservices()
        .then((wss: Webservice[]) => wss.find((ws: Webservice) => ws.id === id));
  }
}
