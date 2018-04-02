import {Component,
        Input,
        OnInit,
        OnChanges,
        OnDestroy} from '@angular/core';
import {FormArray,
        FormBuilder,
        FormGroup} from '@angular/forms';
import {ModalDismissReasons,
        NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Http,
        Response} from '@angular/http';
import {Node} from '../../shared/models/node.model';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../shared/services/project.service';

@Component({
  selector: 'app-webserviceresponse-form',
  templateUrl: './webserviceresponse-form.component.html'
})
export class WebServiceResponseComponent implements OnChanges, OnDestroy {
  @Input()
  project: Project;
  @Input()
  node: Node;
  @Input()
  neighbors;
  input_params = [{node:"node1", key:"test", value:"test"}];
  webserviceForm: FormGroup;
  paramGroup: FormGroup;
  selected;
  methods = ['GET', 'POST', 'PUT', 'DELETE'];
  checked = [true, false, false, false];
  paramModal;
  paramIndex;
  isJSON;

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService, private modalService: NgbModal, private http: Http) {}

  ngOnInit(): void {
    if (!this.node) {
      console.log("can't display node");
      return;
    }

    if(this.node) {
      console.log("displaying node");
      console.log(this.node);

      if(this.node.res_params == null) // for legacy support
        this.node.res_params = [];

      this.paramModal = null;

      // change default display value
      var index = this.methods.indexOf(this.node.method);
      this.checked[index] = true;

      // save default method
      this.selected = this.node.method;
      this.webserviceForm = this.createFormGroup(this.node);
    }
    this.paramGroup = this.formBuilder.group({});
  }

  ngOnChanges(): void {
    // do something?
  }

  ngOnDestroy(): void {
    this.saveChange();
  }

  private createFormGroup(data): FormGroup {
    return this.formBuilder.group({
      response: this.formatJSON(data.response), // make sure it is JSON first!
      param_keys: this.createParamKeysFormArray(data.res_params),
      param_vals: this.createParamValsFormArray(data.res_params)
    });
  }

  private createParamKeysFormArray(params): FormArray {
    const paramKeysControlArray = params.map(param => this.formBuilder.control(param.key));
    return this.formBuilder.array(paramKeysControlArray);
  }

  get param_keys(): FormArray {
    return this.webserviceForm.get('param_keys') as FormArray;
  }

  private createParamValsFormArray(params): FormArray {
    const inputs = params.map(param => this.formBuilder.control(param.val));
    let input_forms = this.formBuilder.array(inputs);
    params.map((param, index) => {
      if(param.link != null)
        input_forms.controls[index].disable()
    });
    return input_forms;
  }

  get param_vals(): FormArray {
    return this.webserviceForm.get('param_vals') as FormArray;
  }

  removeParameter(i): void {
    //alert('not implemented yet');
    console.log("Attemping to remove parameter #" + i + " in node " + this.node.title);
    if(this.node) {
      this.node.res_params.splice(i, 1);
      this.param_keys.removeAt(i);
      this.param_vals.removeAt(i);
    }
  }

  addParameter(key:string): void {
    this.param_keys.push(this.formBuilder.control(key));
    this.param_vals.push(this.formBuilder.control(''));
    if(this.node) {
      this.node.res_params.push({key:key,val:'',link:null});
    }
  }

  linkParameter(i, modal): void {
    this.paramModal = this.modalService.open(modal);
    this.paramIndex = i;

    this.paramModal.result.then((result) => {
      //this.graph.updateGraph();
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
  }

  paramLink(i):void {
    // do something
    console.log("linking index: " + i);
    console.log(this.param_vals.controls[this.paramIndex]);

    let param = this.input_params[i];

    this.param_vals.controls[this.paramIndex].setValue(param.node + "->" + param.key);
    this.param_vals.controls[this.paramIndex].disable();
    this.node.res_params[this.paramIndex].link = {node:param.node, key:param.key};

    if(this.paramModal != null)
      this.paramModal.close();
  }

  saveChange(): void {
    if(this.node) {
      // search for the right node to update
      this.param_vals.controls.forEach((form, index) => this.node.res_params[index].val = form.value);
    }
    
    this.projectService.updateProjectToService(this.project);

    // then save the project to the database
    this.projectService.updateProjectDb(this.project);
  }

  testService() {
    const webform = this;
    var url = this.webserviceForm.get('url').value;
    var method = this.selected;
    var param_keys = [];
    var param_vals = [];

    this.param_keys.controls.forEach((form, index) => param_keys[index] = form.value);
    this.param_vals.controls.forEach((form, index) => param_vals[index] = form.value);

    console.log("Testing " + url + " with method " + method);
    console.log(param_keys);
    console.log(param_vals);

    this.http.post('/webservice/rest/ws/query', {url: url, method: method, param_keys: param_keys, param_vals: param_vals})
             .map((res: Response) => res.json())
             .subscribe(
                (res:any) => {
                  var time = res.time / 1000000;
                  if (res.time > 0) {
                    console.log("Finished testing " + url);
                    console.log(res);
                    webform.node.response = res.response;
                  }
                  else
                    alert("WebService query failed (check URL?)");
                },
                (err: any) => console.log(err),
                () => console.log("BENCHMARKED WEBSERVICE"));
  }

  methodChange(event) {
    //console.log(event);
    console.log("chose " + event.target.value);
    this.selected = event.target.value;
  }

  currentMethod(method) {
    return method == this.node.method;
  }

  formatJSON(text) {
    var ret = text;
    try {
      ret = JSON.stringify(JSON.parse(text), null, 2);
      this.isJSON = true;
    }
    catch(e) {
      console.log("response was not in JSON form");
      this.isJSON = false;
    }

    return ret;
  }
}
