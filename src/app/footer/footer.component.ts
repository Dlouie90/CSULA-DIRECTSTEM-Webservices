import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    calStateLogoUrl =
        'http://www.calstatela.edu/sites/default/files/users/u10891/' +
        'calstatelalogo_shield_4color2.jpg';

    constructor() { }

}
