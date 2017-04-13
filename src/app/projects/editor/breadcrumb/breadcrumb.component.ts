import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {View} from '../../../shared/view.model';

@Component({
  selector   : 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls  : ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  @Input()
  views: Array<View>;

  @Output()
  emitViewSelectIndex = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  /** Return the parentNode title. If the parentNode is null then
   * it is a root node, return "root node" instead. */
  getViewTitle(view: View): string {
    return view.parentNode ? view.parentNode.title : 'root-node';
  }

  /** Emit the index */
  emitViewIndex(index: number): void {
    this.emitViewSelectIndex.emit(index);
  }
}
