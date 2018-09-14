import {
    Component,
    ElementRef,
    ViewChild,
    Input,
    OnInit,
    OnDestroy,
    AfterViewInit
} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import * as d3 from 'd3';
import {Project} from '../../shared/models/project.model';
import {ProjectService} from '../../shared/services/project.service';
import {Node} from '../../shared/models/node.model';
import {Chart} from 'chart.js';

@Component({
    selector: 'app-line-chart-comparison',
    templateUrl: './line-chart-comparison.component.html',
    styleUrls: ['./line-chart-comparison.component.css']
})
export class LineChartComparisonComponent implements OnInit, OnDestroy {
    // limits current display to 24 entries
    // so once per hour should give you 24 hours!
    // but you can totally set a higher limit!
    DISPLAY_LIMIT = 24;

    @ViewChild('canvas')
    canvas: ElementRef;

    @Input()
    project: Project;

    nodes: Node[] = [];
    newNode: string;
    socketsRunning = false;
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
    chart: Chart;
    labels = [];
    data = [];
    websockets: WebSocket[] = [];
    interval = -1;
    intervals =
        [{
            text: '3 seconds',
            time: 3
        },
            {
                text: '5 seconds',
                time: 5,
            }, {
            text: '10 seconds',
            time: 10,
        }, {
            text: '30 seconds',
            time: 30,
        }, {
            text: '1 minute',
            time: 60,
        }, {
            text: '2 minutes',
            time: 120,
        }, {
            text: '5 minutes',
            time: 300,
        }, {
            text: '10 minutes',
            time: 600,
        }, {
            text: '15 minutes',
            time: 900,
        }, {
            text: '30 minutes',
            time: 1800,
        }, {
            text: '1 hour',
            time: 3600,
        }];

    constructor(element: ElementRef, private projectService: ProjectService, public activeModal: NgbActiveModal) {
        this.host = d3.select(element.nativeElement);
    }

    ngOnInit() {
        // do something
        Chart.pluginService.register({
            afterUpdate: function (chart) {
                for (var d = 0; d < chart.config.data.datasets.length; d++) {
                    var dataset = chart.config.data.datasets[d];
                    var meta = dataset._meta;
                    var key = -1;

                    for (var i = 0; i < 10; i++)
                        if (meta[i])
                            key = i;

                    for (var i = 0; i < dataset.data.length; i++) {
                        if (dataset.data[i].y == 0) {
                            meta[key].data[i]._model.pointStyle = 'crossRot';
                            meta[key].data[i]._model.pointRadius = 8.0;
                            meta[key].data[i]._model.borderWidth = 4.0;
                            meta[key].data[i]._model.hitRadius = 16.0;
                            meta[key].data[i]._model.radius = 8.0;
                        }
                    }
                }
            },
            afterEvent: function (chart) {
                for (var d = 0; d < chart.config.data.datasets.length; d++) {
                    var dataset = chart.config.data.datasets[d];
                    var meta = dataset._meta;
                    var key = -1;

                    for (var i = 0; i < 10; i++)
                        if (meta[i])
                            key = i;

                    for (var i = 0; i < dataset.data.length; i++) {
                        if (dataset.data[i].y == 0) {
                            meta[key].data[i]._model.pointStyle = 'crossRot';
                            meta[key].data[i]._model.pointRadius = 8.0;
                            meta[key].data[i]._model.borderWidth = 4.0;
                            meta[key].data[i]._model.hitRadius = 16.0;
                            meta[key].data[i]._model.radius = 8.0;
                        }
                    }
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.stopMonitor();
    }

    ngAfterViewInit() {
        this.initializeChart();
    }

    initializeChart() {
        /*
        let stats = this.node.stats;

        stats.forEach(s => {
          this.labels.push(s.date);
          this.data.push(s.runtime);
        });
        */

        const config = {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: this.nodes.map((node, index) => {
                    const colors = Object.keys(this.chartColors);
                    const color = colors[index % colors.length];
                    this.data[index] = [];
                    return {
                        label: `${node.title} Performance Data`,
                        backgroundColor: this.chartColors[color],
                        borderColor: this.chartColors[color],
                        data: this.data[index],
                        fill: false
                    };
                })
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
                    callbacks: {
                        title: function (tooltipItems, data) {
                            return tooltipItems[0].xLabel;
                        },
                        label: function (tooltipItem, data) {
                            if (tooltipItem.yLabel > 0) {
                                let rounded = Math.round(tooltipItem.yLabel * 100) / 100;
                                return 'Response time: ' + rounded + 'ms';
                            }
                            else return 'Connection failed!';
                        }
                    }
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

        const ctx = this.canvas.nativeElement.getContext('2d');
        this.chart = new Chart(ctx, config);
    }

    addData(label, data, index) {
        this.labels.push(label);
        this.data[index].push({x: label, y: data});

        if (this.chart) {
            this.chart.update();
        }
    }

    removeFirstData(index): void {
        this.labels.splice(0, 1);
        this.data[index].splice(0, 1);

        if (this.chart) {
            this.chart.update();
        }
    }

    startMonitor(): void {
        if (this.interval === -1 || this.nodes.length === 0) {
            return;
        }

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            this.prepareSocket(node, new WebSocket('ws://localhost:8080/webservice/socket/performance'), i);
        }

        this.socketsRunning = true;
        this.initializeChart();

        console.log('refreshing monitor');
    }

    prepareSocket(node: Node, ws: WebSocket, index: number): void {
        const context = this;
        this.websockets[index] = ws;

        ws.onopen = function (event) {
            const url = node.url;
            const method = node.method;
            const param_keys = [];
            const param_vals = [];
            const interv = context.intervals[context.interval].time * 1000; // convert from s to ms

            if (node.params) {
                node.params.forEach((param, index) => {
                    param_keys[index] = param.key;
                    if (param.link == null) {
                        param_vals[index] = param.val;
                    } else {
                        // param_vals[index] = this.findNode(param.link.node_id).res_params[param.link.param_i].val;
                    }
                });
            }

            const webservice = {
                'url': url,
                'method': method,
                'param_keys': param_keys,
                'param_vals': param_vals,
                'interval': interv
            };

            const msg = JSON.stringify(webservice);
            ws.send(msg);
        };

        ws.onmessage = function (event) {
            const d = new Date();
            const date = d.toISOString();
            const res = JSON.parse(event.data);
            const time = res.time / 1000000;

            if (time > 0) {
                // update graph display
                context.addData(date, time, index);
                if (context.data[index].length > context.DISPLAY_LIMIT) {
                    context.removeFirstData(index);
                }

                // update the node
                node.response = res.response;
                node.time_text = time.toFixed(2) + 'ms';
                node.stats.push({date: date, runtime: time});
                node.just_benchmarked = true;
            }
            else {
                // update graph display
                context.addData(date, 0, index);

                if (context.data[index].length > context.DISPLAY_LIMIT)
                    context.removeFirstData(index);
            }
        };
    }

    stopMonitor() {
        for (const websocket of this.websockets) {
            websocket.close();
        }
        this.websockets = [];
        this.socketsRunning = false;
    }

    selectedInterval(index) {
        console.log('selected ' + index);
        this.interval = index;
    }

    onClose(reason: string): void {
        this.activeModal.close(reason);
    }

    get intervalText(): string {
        if (this.interval === -1) {
            return 'Select Interval';
        } else {
            return this.intervals[this.interval].text;
        }
    }

    public addNode(): void {
        for (const node of this.project.nodes) {
            if (node.title === this.newNode) {
                this.nodes.push(node);
                this.newNode = null;
                return;
            }
        }
    }

    public removeNode(node: Node): void {
        this.nodes.splice(this.nodes.indexOf(node), 1);
    }
}
