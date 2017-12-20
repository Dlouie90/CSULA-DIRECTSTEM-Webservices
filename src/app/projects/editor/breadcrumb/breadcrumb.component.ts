import {Component,
        Input,
        OnInit} from '@angular/core';

import {Node} from '../../../shared/models/node.model'

    @Component({
      selector: 'app-breadcrumb',
      templateUrl: './breadcrumb.component.html',
      styleUrls: ['./breadcrumb.component.css']
    })
import {View} from '../../../shared/view.model';

export class BreadcrumbComponent implements OnInit {
  @Input()
  views: Array<View>;

  constructor() {
  }

  ngOnInit() {
  }

  /** Return the parentNode title. If the parentNode is null then
     * it is a root view, return "root view" instead. */
  getViewTitle(view: View): string {
    return view.parentNode ? Node.nodeTitle(view.parentNode) : 'root-view';
  }
}
