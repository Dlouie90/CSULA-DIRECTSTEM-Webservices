import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { WebserviceService } from './webservice.service';

@Component({
    selector: 'app-demo-app',
    templateUrl: './demo-app.component.html',
    styleUrls: ['./demo-app.component.css']
})
export class DemoAppComponent implements OnInit {
    currentService: any;
    result: any;
    guid: string;
    waitingForResponse: boolean;

    serviceArray: any[];

    constructor(private http: Http,
                private webservice: WebserviceService) {
        this.serviceArray = webservice.services;
    }

    ngOnInit() {
    }

    addService(): void {
        this.http.post('/add', this.currentService)
            .toPromise()
            .then(res => this.result = res.json())
            .catch(err => console.log(`add() failed: ${ err }`));
    }

    runService(): void {
        console.log(`running`);
        console.log(this.currentService);
        this.http
            .post('/run', this.currentService)
            .toPromise()
            .then(res => {
                this.result = res.json();
                this.guid = this.result.guid;
            })
            .catch(err => this.result = {error: err});
    }

    getServiceResult(): void {
        this.waitingForResponse = true;
        setTimeout(() => {
            this.waitingForResponse = false;
        }, 2000);

        this.http
            .get(`/result?guid=${ this.guid }`)
            .toPromise()
            .then(res => this.result = res.json())
            .catch(err => this.result = err);
    }

    showSpinner(): boolean {
        return this.waitingForResponse;
    }

    selectService(service: any): void {
        this.currentService = service;
    }
}
