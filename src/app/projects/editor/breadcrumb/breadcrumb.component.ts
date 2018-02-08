import {Component,
        Input,
        OnInit} from '@angular/core';

import {Project} from '../../../shared/models/project.model';
import {Node} from '../../../shared/models/node.model';
import {View} from '../../../shared/view.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
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
    return view.currentProject ? Project.projectTitle(view.currentProject) : 'root-view';
    //return view.parentNode ? Node.nodeTitle(view.parentNode) : 'root-view';
  }
}
