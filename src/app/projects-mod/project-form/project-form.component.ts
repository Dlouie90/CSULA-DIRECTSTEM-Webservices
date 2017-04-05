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

  constructor(private formBuilder: FormBuilder,
              private service: WebserviceService) {
  }

  ngOnInit() {

    this.failSubmit     = false;
    this.inputControls  = [];
    this.inputFormArray = new FormArray(this.inputControls);

    this.group = this.formBuilder.group({
      title      : [null, Validators.required],
      description: [null, Validators.required],
      type       : [null, Validators.required],
      inputs     : this.formBuilder.array([])
    });
  }

  onSubmit(form: FormGroup): void {
    this.inputFormArray = new FormArray(this.inputControls);

    if (form.valid && this.inputFormArray.valid) {

      this.group.setControl('inputs', this.inputFormArray);
      this.service.add(form.value);
      this.failSubmit = false;

      this.resetInputControls();
      form.reset();
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
}

