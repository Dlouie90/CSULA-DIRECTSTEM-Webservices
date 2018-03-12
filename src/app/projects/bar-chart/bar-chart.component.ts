import {Component,
        ElementRef,
        Input,
        OnInit} from '@angular/core';

import * as d3 from 'd3';
import {Project} from '../../shared/models/project.model';
import {Node} from '../../shared/models/node.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input()
  project: Project;
  @Input()
  node: Node;
  host;

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
  }

  ngOnInit() {
    let stats = this.getStats();
    let data = [];

    stats.forEach(s => {
      //console.log(s);
      data.push(s.runtime);
    });

    //console.log(data);

    //const data = [55, 44, 30, 23, 17, 14, 16, 25, 41, 61, 85, 101, 95, 105, 114, 150, 180, 210, 125, 100, 71, 75, 72, 67];

    const barWidth = 18, barPadding = 1;
    let maxValue = Math.ceil(d3.max(data) / 100) * 100; // round up to the nearest hundred

    if(data.length == 0)
      maxValue = 300;

    const heightScale = 300 / maxValue; // always scale to 300

    const dataLength = (data.length > 20) ? data.length : 20;

    const graphWidth = dataLength * (barWidth + barPadding) - barPadding;
    const margin = {top: 10, right: 10, bottom: 10, left: 80};

    const totalWidth = graphWidth + margin.left + margin.right;
    const totalHeight = maxValue + margin.top + margin.bottom;

    const svg = this.host.append('svg')
                    .attr('id', 'svg-barChart')
                    .attr({width: totalWidth, height: totalHeight * heightScale + 50});

    const mainGroup = svg.append('g')
                         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    mainGroup.append('rect').attr({
      fill: 'rgba(0,0,0,0.1)',
      width: totalWidth - (margin.left + margin.right),
      height: (totalHeight - (margin.bottom + margin.top)) * heightScale
    });

    function xloc(d, i) {
      return i * (barWidth + barPadding);
    }

    function yloc(d) {
      return (maxValue - d) * heightScale;
    }

    function translator(d, i) {
      return 'translate(' + xloc(d, i) + ',' + yloc(d) + ')';
    }

    const barGroup = mainGroup.selectAll('g')
                         .data(data)
                         .enter()
                         .append('g')
                         .attr('transform', translator);

    barGroup.append('rect')
        .attr({
          fill: 'steelblue',
          width: barWidth,
          height: function(d) {
            return d * heightScale;
          }
        });

    const textTranslator = 'translate(' + barWidth / 2 + ',0)';

    barGroup.append('text')
        .text(function(d) {
          console.log(d);
          return d.toFixed(2);
        })
        .attr({
          fill: 'black',
          'alignment-baseline': 'before-edge',
          'text-anchor': 'middle',
          transform: textTranslator
        })
        .style('font', '11px sans-serif');

    const leftAxisGroup = svg.append('g');
    const axisPadding = 3;
    leftAxisGroup.attr({transform: 'translate(' + (margin.left - axisPadding) + ',' + margin.top + ')'});
    const scale = d3.scale
                      .linear()
                      .domain([maxValue, 0])
                      .range([0, maxValue * heightScale]);
    const axis = d3.svg.axis()
                     .orient('left')
                     .scale(scale);

    const bottomAxisGroup = svg.append('g')
                                .attr({
                                  transform: `translate(${margin.left - axisPadding},${(totalHeight - margin.bottom - barPadding) * heightScale + 8})`
                                });
    const xScale = d3.scale
                       .linear()
                       .domain([0, dataLength])
                       .range([0, dataLength * (barWidth + barPadding)]);
    const xAxis = d3.svg.axis()
                      .orient('bottom')
                      .scale(xScale);

    const axisNodes = leftAxisGroup.call(axis);
    const xAxisNodes = bottomAxisGroup.call(xAxis);
    const domain = axisNodes.selectAll('.domain');
    domain.attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
    });
    const xDomain = xAxisNodes.selectAll('.domain');
    xDomain.attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
    });
    const ticks = axisNodes.selectAll('.tick line');
    ticks.attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
    });
    const xTicks = xAxisNodes.selectAll('.tick line');
    xTicks.attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
    });

    svg.append('text')  // text label for the x axis
        .attr('x', totalWidth / 2)
        .attr('y', totalHeight * heightScale + 50)
        .style('text-anchor', 'middle')
        .text('MOST RECENT RUNS');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0)
        .attr('x', 0 - (totalHeight / 2) * heightScale)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('RESPONSE TIME (milliseconds)');
  }

  getStats() {
    let stats = [];

    if(this.node == null) {
      if(this.project.stats == null) // fixes legacy projects
        this.project.stats = [];

      if(this.project.stats.length > 20)
        stats = this.project.stats.slice(this.project.stats.length - 21, 20);
      else
        stats = this.project.stats.slice(0, this.project.stats.length);
    }
    else {
      if(this.node.stats == null) // fixes legacy nodes
        this.node.stats = [];

      if(this.node.stats.length > 20)
        stats = this.node.stats.slice(this.node.stats.length - 21, 20);
      else
        stats = this.node.stats.slice(0, this.node.stats.length);
    }

    return stats;
  }
}
