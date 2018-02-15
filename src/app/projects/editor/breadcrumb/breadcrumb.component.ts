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
  controller;
  //views: Array<View>;

  constructor() {
  }

  ngOnInit() {
  }

  /** Return the parentNode title. If the parentNode is null then
     * it is a root view, return "root view" instead. */
  getViewTitle(view: View): string {
    var title = view.currentProject ? Project.projectTitle(view.currentProject) : 'root-view';
    if(this.controller.views.indexOf(view) == 0)
      title += ' (ROOT)';
    return title;
    //return view.parentNode ? Node.nodeTitle(view.parentNode) : 'root-view';
  }

  isCurrent(view):boolean {
    return view.currentProject.id == this.controller.project.id;
  }
}
