import {Component,
        ElementRef,
        Input,
        OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as d3 from 'd3';

import {Project} from '../../shared/models/project.model';
import {Node} from '../../shared/models/node.model';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css']
})
export class VisualComponent implements OnInit {
  @Input()
  project: Project;

  htmlElement;
  host;

  selectedNode;

  constructor(private element: ElementRef, private router: Router) {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.element.nativeElement);
  }

  ngOnInit(): void {
    console.log("DISPLAYING RADIAL TREE");
    this.initTree(this.project);
  }

  /****************************************************/
  /****************************************************/
  /****************************************************/

  initTree(project: Project): void {
    // visual class width = 1000px, thus 500 is the center
    const center = 500;
    const nodeRadius = 25;
    const tooltipDiv = this.host.append('div')
                           .classed('tooltip', true)
                           .style('opacity', 0);
    const mainDiv = this.host.append('div').classed('container', true);
    const svg = mainDiv.append('svg').attr('class', 'visual');
    const mainGroup = svg.append('g')
                          .attr('transform', `translate(${center},${center})`);

    const cluster = d3.layout.cluster()
                        .size([360, center / 1.5]);

    var data = this.makeGraphData(project);
    var root = null;

    data.forEach(n => {
      if(n.type.localeCompare("INPUT") == 0)
        root = n;
    });

    const nodes = cluster.nodes(root);
    const links = cluster.links(data);

    const diagonal = d3.svg.diagonal.radial()
                         .projection(function(d) {
                           return [
                             d.y,
                             d.x / 180 * Math.PI
                           ];
                         });

    mainGroup.selectAll('path')
        .data(links)
        .enter()
        .append('path')
        .attr({
          d: diagonal,
          fill: 'none',
          stroke: '#ccc',
          'stroke-width': 2.5
        });

    const nodeGroups = mainGroup.selectAll('g')
                           .data(nodes)
                           .enter()
                           .append('g')
                           .attr('transform', function(d) {
                             return `rotate(${d.x - 90})translate(${d.y})`;
                           });

    nodeGroups.append('circle')
        .attr('r', (d) => {
          if (d.type.localeCompare("INPUT") == 0) {
            return nodeRadius * 1.75;
          } else if (d.composite_id == null) {
            return nodeRadius / 2;
          } else {
            return nodeRadius / 1.25;
          }
        })
        // Stylesheet graph.css
        .classed('composite-node', (d) => {
          return d.composite_id != null;
        })
        .classed('root-node', (d) => {
          return d.type.localeCompare("INPUT") == 0;
        })
        .on('dblclick', (d) => {
          this.selectedNode = d;
          //this.navigate(d);
          console.log("double clicked on node " + d.title);
        })
        // Tooltip, its excessively ugly but i'm not sure if
        // d3 allow for html template.
        .on('mouseover', (d) => {
          tooltipDiv.transition()
                    .duration(100)
                    .style('opacity', .9);

          tooltipDiv.html(`
              <dl>
                <div class="row">
                  <dt class="col-sm-5">Title:</dt>
                  <dd class="col-sm-7">${d.title}</dd>
                </div>

                <div class="row">
                  <dt class="col-sm-5">URL:</dt>
                  <dd class="col-sm-7">${d.url}</dd>
                </div>

                <div class="row">
                  <dt class="col-sm-5">Run-time:</dt>
                  <dd class="col-sm-7">${d.time}</dd>
                </div>
              </dl>
              `)
              .style('left', (d3.event as any).pageX + 'px')
              .style('top', (d3.event as any).pageY + 'px');
        })
        .on('mouseout', function(d) {
          tooltipDiv.transition()
              .duration(500)
              .style('opacity', 0);
        });

    nodeGroups.append('text')
        .attr('class', 'tree-text')
        .attr({
          dy: '.51em',
          'text-anchor': function(d) {
            return d.x < 180 ? 'start' : 'end';
          },
          transform: (d) => {
            if (d.type.localeCompare("INPUT") == 0) {
              return d.x < 180 ?
                  'translate(' + (nodeRadius * 3.0) + ')' :
                  'rotate(180)' +
                      'translate(' + (-nodeRadius * 3.0) + ')';
            } else {
              return d.x < 180 ?
                  'translate(' + (nodeRadius * 1.50) + ')' :
                  'rotate(180)' +
                      'translate(' + (-nodeRadius * 1.50) + ')';
            }
          }
        })
        .text(function(d) {
          return `${d.title}`;
        });
  }

  makeGraphData(project: Project) {
    var nodes = project.nodes;
    var edges = project.edges;

    var data = [];

    nodes.forEach(n => {
      data.push({
        id: n.id,
        title: n.title,
        url: n.url,
        type: n.type,
        time: n.time_text,
        composite_id: n.composite_id,
        children: []
      });
    });

    edges.forEach(e => {
      data[e.source].children.push(data[e.target]);
    })

    return data;
  }
}
