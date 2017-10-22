import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemoService } from './demo.service';
import { WebserviceConfigMenuComponent } from '../webservice-config-menu/webservice-config-menu.component';


interface DemoQueryParam {
    name: string,
    queryParams: { index: number }
}

@Component({
    selector: 'app-demo-app',
    templateUrl: './demo-app.component.html',
    styleUrls: ['./demo-app.component.css']
})
export class DemoAppComponent implements OnInit {
    paths: DemoQueryParam[];
    currentService: any;
    result: any;
    guid: string;
    waitingForResponse: boolean;
    serviceArray: any[];
    index = 1;

    constructor(private http: Http,
                private webservice: DemoService,
                private route: ActivatedRoute,
                private router: Router,
                private modalService: NgbModal) {

        this.serviceArray = webservice.services;
        this.route.queryParams
            .subscribe(params => this.index = params['index']);

        this.initPaths();
    }

    ngOnInit() { }

    initPaths(): void {
        this.paths = [
            {name: 'Composition', queryParams: {index: 1}},
            {name: 'Service Menu', queryParams: {index: 2}},
            {name: 'User Database', queryParams: {index: 3}},
        ];
    }

    updateIndexTo(value: number): void {
        this.index = value;
        this.router.navigate(['demo'], {
            queryParams: {
                index: value
            }
        });
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

    open(): void {
        this.modalService.open(WebserviceConfigMenuComponent, {size: 'lg'});
    }
}
