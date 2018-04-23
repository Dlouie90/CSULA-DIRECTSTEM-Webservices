import {Component,
        OnInit} from '@angular/core';
import {Path} from '../../shared/models/path.interface';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  paths: Path[];

  constructor() {
  }

  ngOnInit() {
    this.paths = [
      {
        title: 'Web Services Image 1',
        url: 'http://klikkayainovasi.com/img/service-page-web-services.jpg',
      },
      {
        title: 'Web Services Image 2',
        url: 'https://www.forcepoint.com/sites/default/files/styles/' +
            'hero_image/public/product_landscapes/cropped-_0000s_0008_websense-webfilter.jpg?itok=KZaTBKMq'
      }
    ];
  }
}
