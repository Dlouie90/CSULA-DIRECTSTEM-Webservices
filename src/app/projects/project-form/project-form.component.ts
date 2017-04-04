import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WebserviceService} from '../shared/webservice.service';

@Component({
  selector   : 'app-form',
  templateUrl: './project-form.component.html',
  styleUrls  : ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  group: FormGroup;
  failSubmit: boolean;

  constructor(formBuilder: FormBuilder,
              private service: WebserviceService) {

    this.group = formBuilder.group({
      title      : [null, Validators.required],
      description: [null, Validators.required],
      type       : [null, Validators.required],
    });

    this.failSubmit = false;
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup): void {
    if (form.valid) {
      this.service.add(form.value);
      form.reset();
      this.failSubmit = false;
    } else {
      this.failSubmit = true;
    }
  }

  reset(): void {
    this.group.reset();
  }

  isInvalid(controlName): boolean {
    return !this.group.controls[controlName].valid
        && (this.failSubmit || this.group.controls[controlName].touched);
  }
}
