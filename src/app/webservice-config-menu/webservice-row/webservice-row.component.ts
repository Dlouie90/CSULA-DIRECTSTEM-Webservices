import {Component,
        EventEmitter,
        Input,
        OnInit,
        Output} from '@angular/core';

import {Node} from '../../shared/models/node.model';
import {ParameterEntry} from '../../shared/models/parameter-entry.model';
import {IService} from '../../shared/models/service.interface';

@Component({
  selector: 'app-webservice-row',
  templateUrl: './webservice-row.component.html',
  styleUrls: ['./webservice-row.component.css']
})
export class WebserviceRowComponent implements OnInit {
  @Input()
  node: Node;
  @Input()
  parameter: string;
  @Input()
  currentService: IService;
  selectedOption: ParameterEntry;

  constructor() {}

  ngOnInit(): void {
    this.loadOptionPreset();
  }

  loadOptionPreset(): void {
    /*this.selectedOption = this.node
                              .param_vals
                              .find((value:any) => value.targetServiceParameter === this.parameter);*/
  }

  isSelected(param: string): boolean {
    /*const entry = this.node
                      .param_vals
                      .find((value:any) => value.targetServiceParameter === this.parameter && value.parameter === param);
    return entry != null;*/
    return null;
  }

  onSelectOption(param: string): void {
    const entry: ParameterEntry = {
      parameter: param,
      targetServiceId: this.currentService.id,
      targetServiceParameter: this.parameter
    };

    // remove  and replace any entries whose target's is this.parameter,
    // with the latest one, (entry);
    /*const newEntries = this.node
                           .parameterEntries
                           .filter((value: ParameterEntry) => value.targetServiceParameter !== this.parameter);
    newEntries.push(entry);
    this.node.parameterEntries = newEntries;*/
  }
}
