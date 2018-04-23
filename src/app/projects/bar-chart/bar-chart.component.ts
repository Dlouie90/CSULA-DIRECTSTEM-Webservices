import {Component,
        ElementRef,
        ViewChild,
        Input,
        OnInit,
        AfterViewInit} from '@angular/core';

import * as d3 from 'd3';
import {Project} from '../../shared/models/project.model';
import {Node} from '../../shared/models/node.model';
import {Chart} from 'chart.js';
import {ModalDismissReasons,
        NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  // limits current display to 24 entries
  // so once per hour should give you 24 hours!
  // but you can totally set a higher limit!
  DISPLAY_LIMIT = 24;

  @ViewChild('canvas')
  canvas: ElementRef;
  @Input()
  project: Project;
  @Input()
  node: Node;
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
  graphModal;
  colors = [];

  constructor(element: ElementRef, private modalService: NgbModal) {
    // do something
  }

  ngOnInit() {
    // do something
  }

  ngAfterViewInit() {
    //let stats = this.node.stats;
    let stats = this.getStats();
    let labels = [];
    let data = [];

    stats.forEach((s, index) => {
      labels.push(s.date);
      data.push(s.runtime);
    });

    var config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.node.title + "'s Performance",
          backgroundColor: this.chartColors.blue,
          borderColor: this.chartColors.blue,
          data: data,
          fill: false
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: true,
        },
        /*
        title: {
          display: true,
          text: 'Performance of ' + this.node.title
        },
        */
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: function(tooltipItems, data) {
              return labels[tooltipItems[0].index];
            },
            label: function(tooltipItem, data) {
              let rounded = Math.round(tooltipItem.yLabel * 100) / 100;
              return "Response time: " + rounded + "ms";
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            //type: 'time',
            /*
            time: {
              parser: 'YYYY/MM/DD HH:mm:ss',
              //round: 'day',
            },*/
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Benchmark #'
            },
            ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return '' + index;
              }
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Performance (ms)'
            }
          }]
        }
      }
    };

    var ctx = this.canvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, config);
  }

  getStats() {
    let stats = [];

    if(this.node == null) {
      if(this.project.stats == null) // fixes legacy projects
        this.project.stats = [];

      if(this.project.stats.length > this.DISPLAY_LIMIT)
        stats = this.project.stats.slice(this.node.stats.length - this.DISPLAY_LIMIT - 1, this.node.stats.length);
      else
        stats = this.project.stats.slice(0, this.project.stats.length);
    }
    else {
      if(this.node.stats == null) // fixes legacy nodes
        this.node.stats = [];

      if(this.node.stats.length > this.DISPLAY_LIMIT)
        stats = this.node.stats.slice(this.node.stats.length - this.DISPLAY_LIMIT - 1, this.node.stats.length);
      else
        stats = this.node.stats.slice(0, this.node.stats.length);
    }

    return stats;
  }

  openGraphModal(modal) {
    this.graphModal = this.modalService.open(modal);

    this.graphModal.result.then((result) => {
      //this.graph.updateGraph();
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
  }

  addGraph(index) {
    // don't add if data was already added
    var i = this.chart.config.data.datasets.findIndex((d:any) => d.id == this.nodes[index].id);
    if(i > 0) return;

    let stats = this.nodes[index].stats;
    //var labels = [];
    var data = [];

    stats.forEach(s => {
      //labels.push(s.date);
      data.push({x:s.date, y:s.runtime});
    });

    if(data.length > this.DISPLAY_LIMIT)
      data.splice(0, data.length - this.DISPLAY_LIMIT);

    this.chart.config.data.datasets.push(
      {
        id: this.nodes[index].id,
        label: this.nodes[index].title + "'s Performance",
        backgroundColor: this.chartColors.red,
        borderColor: this.chartColors.red,
        data: data,
        fill: false
      }
    );

    this.chart.update();
  }

  removeGraph(index) {
    var index = this.chart.config.data.datasets.findIndex((d:any) => d.id == this.nodes[index].id);

    if(index > 0) {
      this.chart.config.data.datasets.splice(index, 1);
      this.chart.update();
    }
  }

  get nodes(): Node[] {
    var nodes = this.project.nodes.slice();
    var index = nodes.findIndex((n: Node) => n.id == this.node.id);
    nodes.splice(index, 1);
    return nodes;
  }
}
