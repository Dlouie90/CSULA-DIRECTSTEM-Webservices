import {Component,
        ElementRef,
        OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  host;

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
  }

  ngOnInit() {
    const data = [55, 44, 30, 23, 17, 14, 16, 25, 41, 61, 85, 101, 95, 105, 114, 150, 180, 210, 125, 100, 71, 75, 72, 67];

    const barWidth = 15, barPadding = 2;
    const maxValue = d3.max(data);

    const graphWidth = data.length * (barWidth + barPadding) - barPadding;
    const margin = {top: 10, right: 10, bottom: 10, left: 60};

    const totalWidth = graphWidth + margin.left + margin.right;
    const totalHeight = maxValue + margin.top + margin.bottom;

    const svg = this.host.append('svg')
                    .attr('id', 'svg-barChart')
                    .attr({width: totalWidth, height: totalHeight + 50});

    const mainGroup = svg
                          .append('g')
                          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    mainGroup.append('rect').attr({
      fill: 'rgba(0,0,0,0.1)',
      width: totalWidth - (margin.left + margin.right),
      height: totalHeight - (margin.bottom + margin.top)
    });

    function xloc(d, i) {
      return i * (barWidth + barPadding);
    }

    function yloc(d) {
      return maxValue - d;
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
            return d;
          }
        });

    const textTranslator = 'translate(' + barWidth / 2 + ',0)';

    barGroup.append('text')
        .text(function(d) {
          return d;
        })
        .attr({
          fill: 'white',
          'alignment-baseline': 'before-edge',
          'text-anchor': 'middle',
          transform: textTranslator
        })
        .style('font', '10px sans-serif');

    const leftAxisGroup = svg.append('g');
    const axisPadding = 3;
    leftAxisGroup.attr({transform: 'translate(' + (margin.left - axisPadding) + ',' + margin.top + ')'});
    const scale = d3.scale
                      .linear()
                      .domain([maxValue, 0])
                      .range([0, maxValue]);
    const axis = d3.svg.axis()
                     .orient('left')
                     .scale(scale);

    const bottomAxisGroup = svg.append('g')
                                .attr({
                                  transform: `translate(${margin.left - axisPadding},${totalHeight - margin.bottom - barPadding + 5})`
                                });
    const xScale = d3.scale
                       .linear()
                       .domain([0, data.length])
                       .range([0, data.length * (barWidth + barPadding)]);
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
        .attr('y', totalHeight + 35)
        .style('text-anchor', 'middle')
        .text('HOURS');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0)
        .attr('x', 0 - (totalHeight / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('PERFORMANCE');
  }
}
