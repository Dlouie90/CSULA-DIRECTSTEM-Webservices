import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector   : 'app-output-register-form',
  templateUrl: './output-register-form.component.html',
  styleUrls  : ['./output-register-form.component.css']
})
export class OutputRegisterFormComponent implements OnInit {
  @Input()
  properties: Array<[string, string]>;
  nameControl: FormControl;
  typeControl: FormControl;
  options: string[];
  failedSubmit: boolean;

  constructor() {
  }

  ngOnInit() {
    this.nameControl  = new FormControl(null, Validators.required);
    this.typeControl  = new FormControl(null, Validators.required);
    this.failedSubmit = false;
    this.options      = [
      'Object',
      'String',
      'Number',
      'Boolean',
    ];
  }

  isInvalid(control: FormControl): boolean {
    return !control.valid && control.touched;
  }

  removeProperty(property: [string, string]): void {
    const index = this.properties.indexOf(property);
    this.properties.splice(index, 1);
  }

  registerProperty(): void {
    if (this.nameControl.valid && this.typeControl.valid) {
      this.properties.push([this.nameControl.value, this.typeControl.value]);

      this.nameControl.reset();
      this.typeControl.reset();
      this.failedSubmit = false;
    } else {
      this.failedSubmit = true;
    }
  }
}
