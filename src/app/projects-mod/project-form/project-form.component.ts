import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WebserviceService} from '../../shared/webservice.service';

@Component({
  selector   : 'app-form',
  templateUrl: './project-form.component.html',
  styleUrls  : ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  group: FormGroup;
  failSubmit: boolean;

  parameters: Array<[string, string]>;
  properties: Array<[string, string, string]>;


  constructor(private formBuilder: FormBuilder,
              private service: WebserviceService) {
  }

  ngOnInit() {
    this.parameters = [];
    this.properties = [];
    this.failSubmit = false;

    this.group = this.formBuilder.group({
      title      : [null, Validators.required],
      description: [null, Validators.required],
      type       : [null, Validators.required],
      domain     : [null, Validators.required],
      path       : [null, Validators.required],
    });
  }

  onSubmit(form: FormGroup): void {
    if (form.valid) {
      const args = form.value;

      Object.assign(args, {parameters: this.parameters});
      Object.assign(args, {properties: this.properties});

      console.log(args);
      this.service.add(args);
      this.failSubmit = false;

      this.resetToggleInputs();
      form.reset();
    } else {
      this.failSubmit = true;
    }
  }

  reset(): void {
    this.group.reset();
    this.resetToggleInputs();
  }

  resetToggleInputs(): void {
    this.properties = [];
    this.parameters = [];
  }

  isInvalid(controlName: string): boolean {
    return !this.group.controls[controlName].valid
        && (this.failSubmit || this.group.controls[controlName].touched);
  }

}
