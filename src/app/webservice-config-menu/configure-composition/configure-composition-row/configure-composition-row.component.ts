import {Component,
        Input,
        OnChanges,
        OnInit} from '@angular/core';
import {Node} from '../../../shared/models/node.model';

@Component({
  selector: 'app-configure-row',
  templateUrl: './configure-composition-row.component.html',
  styleUrls: ['./configure-composition-row.component.css'],
})
export class ConfigureCompositionRowComponent implements OnInit, OnChanges {
  @Input()
  node: Node;
  @Input()
  inputNodes: Node[];
  @Input()
  parameter: string;
  selectedInputEntry;

  ngOnInit(): void {
    this.loadPreset();
  }

  ngOnChanges(): void {}

  private loadPreset(): void {
    /*
    this.selectedInputEntry = this.node
                                  .inputEntries
                                  .find((value: InputEntry) => value.toParameter === this.parameter);*/
  }

  isSelected(inputNode: Node): boolean {
    if (!this.selectedInputEntry) {
      return false;
    }
    return this.selectedInputEntry.fromNode.id === inputNode.id;
  }


  onChange(stringId: string): void {
    const id = parseInt(stringId, 10);
    /*
    const selectedInputNode = this.inputNodes
                                  .find((value: Node) => value.id === id);*/

    /*const entry: InputEntry = {
      fromNode: selectedInputNode,
      toParameter: this.parameter
    };*/

    /*
    const newEntries = this.node
                           .inputEntries
                           .filter((value: InputEntry) => value.toParameter !== this.parameter);*/

    //newEntries.push(entry);
    //this.node.inputEntries = newEntries;
    //this.selectedInputEntry = entry;
  }
}
