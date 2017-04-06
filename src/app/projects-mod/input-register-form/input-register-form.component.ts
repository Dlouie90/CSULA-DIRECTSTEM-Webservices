import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector   : 'app-input-register-form',
  templateUrl: './input-register-form.component.html',
  styleUrls  : ['./input-register-form.component.css']
})
export class InputRegisterFormComponent implements OnInit {
  @Input()
  parameters: Array<[string, string]>;
  nameControl: FormControl;
  descriptionControl: FormControl;
  failedSubmit: boolean;

  constructor() {
  }

  ngOnInit() {
    this.nameControl        = new FormControl(null, Validators.required);
    this.descriptionControl = new FormControl(null, Validators.required);
    this.failedSubmit       = false;
  }

  isInvalid(control: FormControl): boolean {
    return this.failedSubmit || (!control.valid && control.touched);
  }

  deRegisterInput(parameter: [string, string]): void {
    const index = this.parameters.indexOf(parameter);
    this.parameters.splice(index, 1);
  }

  registerParameter(): void {
    if (this.nameControl.valid && this.descriptionControl.valid) {
      this.parameters.push([this.nameControl.value, this.descriptionControl.value]);

      this.nameControl.reset();
      this.descriptionControl.reset();
      this.failedSubmit = false;
    } else {
      this.failedSubmit = true;
    }
  }
}
