import { Component } from '@angular/core';
import { Path } from '../shared/models/path.interface';

@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
    paths: Path[];
    calstateLogoShieldSrc = 'assets/images/calstate-logo-shield.jpg';

    constructor() {
        this.paths = [
            {title: 'Home', url: 'home'},
            {title: 'Projects', url: 'projects'},
            {title: 'Debug', url: 'debug'},
            {title: 'Demo', url: 'demo'}
        ];
    }
}
