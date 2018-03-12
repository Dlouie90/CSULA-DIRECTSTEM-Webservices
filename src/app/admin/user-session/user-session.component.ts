import {Component, ElementRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as d3 from 'd3';
// import {User} from '../../shared/models/user.model';

@Component({
  selector: 'app-user-session',
  templateUrl: './user-session.component.html',
  styleUrls: ['./user-session.component.css']
})
export class UserSessionComponent implements OnInit {
  // user: User;
  htmlElement;
  host;

  constructor(private element: ElementRef, private router: Router) {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.element.nativeElement);
}

  ngOnInit() {
      this.initUserBar();
  }

  initUserBar(): void {
      const margin = {top: 10, right: 30, bottom: 30, left: 30},
          width = 500 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;
      const mainDiv = this.host.append('div')
          .classed('container', true);
      const svg = mainDiv.append('svg')
          .attr('class', 'userGraph')
          .attr('style', 'outline: thin solid;')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Generate a log-normal distribution with a median of 30 minutes.
      const values = d3.range(100).map(d3.random.logNormal(Math.log(30), .4));

      // Formatters for counts and times (converting numbers to Dates).
      const formatCount = d3.format(',.0f'),
          formatTime = d3.time.format('%H:%M'),
          formatMinutes = function (d) {
              return formatTime(new Date(2012, 0, 1, 0, d));
          };

      const x = d3.scale.linear()
          .domain([0, 90])
          .range([0, width]);

      const data = d3.layout.histogram()
          .bins(x.ticks(20))
          (values);

      const y = d3.scale.linear()
          .domain([0, d3.max(data, function (d) {
              return d.y;
          })])
          .range([height, 0]);

      const xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .tickFormat(formatMinutes);

      const bar = svg.selectAll('.bar')
          .data(data)
          .enter().append('g')
          .attr('class', 'bar')
          .attr('transform', function (d) {
              return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
          });

      bar.append('rect')
          .attr('x', 1)
          .attr('width', x(data[0].dx) - 1)
          .attr('height', function (d) {
              return height - y(d.y);
          });

      bar.append('text')
          .attr('dy', '.75em')
          .attr('y', 6)
          .attr('x', x(data[0].dx) / 2)
          .attr('text-anchor', 'middle')
          .text(function (d) {
              return formatCount(d.y);
          });

      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
  }

  initUserLinear(): void {

  }

}
