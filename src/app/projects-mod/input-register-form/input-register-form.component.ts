import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, Validators} from '@angular/forms';

@Component({
  selector   : 'app-input-register-form',
  templateUrl: './input-register-form.component.html',
  styleUrls  : ['./input-register-form.component.css']
})
export class InputRegisterFormComponent implements OnInit {
  @Input()
  controls: FormControl[];
  controlsFormArray: FormArray;
  registerControl: FormControl;

  constructor() {
  }

  ngOnInit() {
    this.registerControl   = new FormControl(null, Validators.required);
    this.controlsFormArray = new FormArray(this.controls);
  }

  isInvalid(control: FormControl): boolean {
    return !control.valid && control.touched;
  }

  deRegisterInput(control: FormControl): void {
    const index = this.controls.indexOf(control);
    this.controls.splice(index, 1);
  }

  registerInput(): void {
    if (this.registerControl.valid) {
      this.controlsFormArray.push(new FormControl(
          this.registerControl.value, Validators.required));
    }
    this.registerControl.reset();
  }
}
