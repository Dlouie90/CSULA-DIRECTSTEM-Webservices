import {Component,
        ElementRef,
        ViewChild,
        Input,
        OnInit,
        OnDestroy,
        AfterViewInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import * as d3 from 'd3';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../shared/services/project.service';
import {Node} from '../../shared/models/node.model';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnDestroy {
  @ViewChild('canvas')
  canvas: ElementRef;
  @Input()
  project: Project;
  @Input()
  node: Node;
  host;
  chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };
  chart:Chart;
  labels = [];
  data = [];
  websocket;
  interval = -1;
  intervals =
    [{
      text: "5 seconds",
      time: 5,
    }, {
      text: "10 seconds",
      time: 10,
    }, {
      text: "30 seconds",
      time: 30,
    }, {
      text: "1 minute",
      time: 60,
    }, {
      text: "2 minutes",
      time: 120,
    }, {
      text: "5 minutes",
      time: 300,
    }, {
      text: "10 minutes",
      time: 600,
    }, {
      text: "15 minutes",
      time: 900,
    }, {
      text: "30 minutes",
      time: 1800,
    }, {
      text: "1 hour",
      time: 3600,
    }];

  constructor(element: ElementRef, private projectService: ProjectService, public activeModal: NgbActiveModal) {
    this.host = d3.select(element.nativeElement);
  }

  ngOnInit() {
    // do something
  }

  ngOnDestroy(): void {
    this.stopMonitor();
  }

  ngAfterViewInit() {
    /*
    let stats = this.node.stats;

    stats.forEach(s => {
      this.labels.push(s.date);
      this.data.push(s.runtime);
    });
    */

    var config = {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Performance Data',
          backgroundColor: this.chartColors.red,
          borderColor: this.chartColors.red,
          data: this.data,
          fill: false
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        /*
        title: {
          display: true,
          text: 'Performance of ' + this.node.title
        },
        */
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            type: 'time',
            /*
            time: {
              parser: 'YYYY/MM/DD HH:mm:ss',
              //round: 'day',
            },*/
            display: true,
            /*
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }*/
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Performance'
            }
          }]
        }
      }
    };

    var ctx = this.canvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, config);
  }

  addData(label, data) {
    this.labels.push(label);
    this.data.push(data);

    if(this.chart)
      this.chart.update();
  }

  removeFirstData() {
    this.labels.splice(0, 1);
    this.data.splice(0, 1);

    if(this.chart)
      this.chart.update();
  }

  startMonitor() {
    if(this.interval == -1 || this.websocket != null)
      return;

    console.log("refreshing monitor");
    this.websocket = new WebSocket("ws://localhost:8080/webservice/socket/performance");

    var context = this;
    var ws = this.websocket;
    var node = this.node;

    ws.onmessage = function(event) {
      //console.log(event.data);
      var d = new Date();
      var date = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      var res = JSON.parse(event.data);
      var time = res.time / 1000000;

      if(time > 0) {
        // update graph display
        context.addData(date, time);
        // limits current display to 24 entries
        // so once per hour should give you 24 hours!
        // but you can totally set a higher limit!
        if(context.data.length > 24)
          context.removeFirstData();

        // update the node
        node.response = res.response;
        node.time_text = time.toFixed(2) + "ms";
        node.stats.push({date:date, runtime:time});
        node.just_benchmarked = true;
      }
    };

    ws.onopen = function(event) {
      var url = node.url;
      var method = node.method;
      var param_keys = [];
      var param_vals = [];
      var interv = context.intervals[context.interval].time * 1000; // convert from s to ms

      node.params.forEach((param, index) => {
        param_keys[index] = param.key;
        if(param.link == null)
          param_vals[index] = param.val;
        else {
          param_vals[index] = this.findNode(param.link.node_id).res_params[param.link.param_i].val;
        }
      });

      var webservice = {url: url, method: method, param_keys: param_keys, param_vals: param_vals, interval: interv};

      var msg = JSON.stringify(webservice);
      //console.log(msg);
      ws.send(msg);
    }
  }

  stopMonitor() {
    console.log("stopping modal");
    if(this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  selectedInterval(index) {
    console.log("selected " + index);
    this.interval = index;
  }

  onClose(reason: string): void {
    this.activeModal.close(reason);
  }

  get chartTitle(): string {
    if(this.node == null)
      return this.project.title;
    else
      return this.node.title;
  }

  get intervalText(): string {
    if(this.interval == -1)
      return "Select Interval";
    else
      return this.intervals[this.interval].text;
  }
}
