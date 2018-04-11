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
  selector: 'app-webservicebuilder-form',
  templateUrl: './webservicebuilder-form.component.html'
})
export class WebServiceBuilderComponent implements OnChanges, OnDestroy {
  @Input()
  project: Project;
  @Input()
  node: Node;
  @Input()
  neighbors;
  //input_params = [{node:{title:"node1"}, p_index:-1, key:"test", value:"test"}];
  input_params = [];
  webserviceForm: FormGroup;
  paramGroup: FormGroup;
  selected;
  methods = ['GET', 'POST', 'PUT', 'DELETE'];
  checked = [true, false, false, false];
  paramModal;
  paramIndex;

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService, private modalService: NgbModal, private http: Http) {}

  ngOnInit(): void {
    if (!this.node) {
      console.log("can't display node");
      return;
    }

    if(this.node) {
      console.log("displaying node");
      console.log(this.node);

      if(this.node.params == null) // for legacy support
        this.node.params = [];

      console.log(this.neighbors);

      this.neighbors.forEach(node => {
        node.res_params.forEach((param, index) => {
          this.input_params.push({node:node, p_index:index, key:param.key, value:param.val});
        });
      });

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
      id: data.id,
      title: data.title,
      description: data.description,
      url: data.url,
      method: data.method,
      param_keys: this.createParamKeysFormArray(data.params),
      param_vals: this.createParamValsFormArray(data.params)
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
      if(param.link != null) {
        var link = param.link;
        var node = this.findNode(link.node_id);

        if(node != null) {
          input_forms.controls[index].disable();
          input_forms.controls[index].setValue("[" + node.title + "] > " + node.res_params[link.param_i].key);
        }
        else input_forms.controls[index].setValue("");
      }
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
      this.project.nodes.forEach((n:Node) => {
        if(n.id == this.node.id) {
          console.log("Removing parameter from project, too");
          n.params.splice(i, 1);
        }
      });
      this.node.params.splice(i, 1);
      this.param_keys.removeAt(i);
      this.param_vals.removeAt(i);
    }
  }

  addParameter(key:string): void {
    this.param_keys.push(this.formBuilder.control(key));
    this.param_vals.push(this.formBuilder.control(''));
    if(this.node) {
      // search for the right node to update
      this.project.nodes.forEach((n: Node) => {
        if(n.id == this.node.id)
          n.params.push({key:key,val:'',link:null});
      });
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

    this.param_vals.controls[this.paramIndex].setValue("[" + param.node.title + "] > " + param.key);
    this.param_vals.controls[this.paramIndex].disable();
    this.node.params[this.paramIndex].link = {node_id:param.node.id, param_i:param.p_index};

    if(this.paramModal != null)
      this.paramModal.close();
  }

  saveChange(): void {
    if(this.node) {
      // search for the right node to update
      this.project.nodes.forEach((n: Node) => {
        if(n.id == this.node.id) {
          n.url = this.webserviceForm.get('url').value;
          n.method = this.selected;
          this.param_vals.controls.forEach((form, index) => n.params[index].val = form.value);
        }
      });
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
    this.param_vals.controls.forEach((form, index) => {
      if(!form.disabled) // just get straight value
        param_vals[index] = form.value
      else { // fetch the value from neighbor
        var link = this.node.params[index].link;
        param_vals[index] = this.findNode(link.node_id).res_params[link.param_i].val;
      }
    });

    console.log("Testing " + url + " with method " + method);
    console.log(param_keys);
    console.log(param_vals);

    this.http.post('/webservice/rest/ws/query', {url: url, method: method, param_keys: param_keys, param_vals: param_vals, interval: 0})
             .map((res: Response) => res.json())
             .subscribe(
                (res:any) => {
                  var time = res.time / 1000000;
                  if (res.time > 0) {
                    console.log("Finished testing " + url);
                    console.log(res);
                    webform.node.response = res.response;

                    webform.node.time_text = time.toFixed(2) + "ms";

                    var d = new Date();
                    var date = d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                    webform.node.stats.push({date: date, runtime: time});
                    webform.node.just_benchmarked = true;
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

  findNode(id) {
    var node = null;
    this.project.nodes.forEach(n => {
      if(n.id == id)
        node = n;
    });
    return node;
  }
}
