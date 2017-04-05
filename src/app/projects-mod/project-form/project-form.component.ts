import {Component, OnInit} from '@angular/core';
import {
  FormArray, FormBuilder, FormControl, FormGroup,
  Validators
} from '@angular/forms';
import {WebserviceService} from '../../shared/webservice.service';

@Component({
  selector   : 'app-form',
  templateUrl: './project-form.component.html',
  styleUrls  : ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  group: FormGroup;
  failSubmit: boolean;

  inputControls: FormControl[];
  inputFormArray: FormArray;
  registerControl: FormControl;

  constructor(formBuilder: FormBuilder,
              private service: WebserviceService) {

    this.failSubmit      = false;
    this.inputControls   = [];
    this.inputFormArray  = new FormArray(this.inputControls);
    this.registerControl = new FormControl(null, Validators.required);

    this.group = formBuilder.group({
      title      : [null, Validators.required],
      description: [null, Validators.required],
      type       : [null, Validators.required],
      inputs     : formBuilder.array(this.inputControls)
    });

  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup): void {
    if (form.valid && this.inputFormArray.valid) {
      this.group.setControl('inputs', this.inputFormArray);
      this.service.add(form.value);
      form.reset();
      this.failSubmit = false;

      this.resetInputControls();
    } else {
      this.failSubmit = true;
    }
  }

  reset(): void {
    this.group.reset();
    this.resetInputControls();
  }

  resetInputControls(): void {
    this.inputControls  = [];
    this.inputFormArray = new FormArray(this.inputControls);
  }

  isInvalid(controlName: string): boolean {
    return !this.group.controls[controlName].valid
        && (this.failSubmit || this.group.controls[controlName].touched);
  }

  isInvalidFC(control: FormControl): boolean {
    return !control.valid && control.touched;
  }

  registerInput(): void {
    if (this.registerControl.valid) {
      this.inputFormArray.push(new FormControl(
          this.registerControl.value, Validators.required));
    }
    this.registerControl.reset();
  }

  deRegisterInput(control: FormControl): void {
    const index = this.inputControls.indexOf(control);
    this.inputControls.splice(index, 1);
  }
}

