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
    console.log("refreshing monitor");
    this.websocket = new WebSocket("ws://localhost:8080/webservice/socket/performance");

    var context = this;
    var ws = this.websocket;
    var node = this.node;

    ws.onmessage = function(event) {
      //var log = document.getElementById("log");
      var d = new Date();
      var date = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      //console.log(event.data);

      if(event.data == "result") {
        context.addData(date, Math.random() * 1000);
        if(context.data.length > 20)
          context.removeFirstData();
      }
      //var message = JSON.parse(event.data);
      //log.innerHTML += message.from + " : " + message.content + "\n";
    };

    ws.onopen = function(event) {
      console.log(event.data);
      var msg = "measure " + node.url;
      console.log(msg);
      ws.send(msg);
    }
  }

  stopMonitor() {
    console.log("stopping modal");
    if(this.websocket)
      this.websocket.close();
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
}
