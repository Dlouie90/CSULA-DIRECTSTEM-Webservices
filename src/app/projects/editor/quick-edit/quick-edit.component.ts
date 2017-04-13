import {Component, Input, OnInit} from '@angular/core';
import {Node} from '../../../shared/node.model';
import {NodeService} from '../../../shared/node.service';
import {FormControl, FormGroup} from '@angular/forms';

/**
 * A form to update a Node object. Used with a modal. This component
 * is tightly coupled with the editor component
 */
@Component({
  selector   : 'app-quick-edit',
  templateUrl: './quick-edit.component.html',
  styleUrls  : ['./quick-edit.component.css']
})
export class QuickEditComponent implements OnInit {
  @Input()
  node: Node;

  /* This function is used to close the modal that this form
   * will be embedded to. Again, its very tightly coupled with
   * the editor component. */
  @Input()
  closeFunction;

  fGroup: FormGroup;

  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    /* Ensure the node is the latest */
    this.nodeService.refreshNode(this.node);

    this.fGroup = new FormGroup({
      id         : new FormControl(this.node.id),
      title      : new FormControl(this.node.title),
      domain     : new FormControl(this.node.domain),
      path       : new FormControl(this.node.path),
      type       : new FormControl(this.node.type),
      description: new FormControl(this.node.description)
    });
  }

  /** Save the change made on the forms (no validation) and called the
   * closeFunction to close the modal. */
  saveUpdate(): void {
    Object.assign(this.node, this.fGroup.value);
    this.nodeService.update(this.fGroup.value);
    this.closeFunction('close, saved');
  }
}
