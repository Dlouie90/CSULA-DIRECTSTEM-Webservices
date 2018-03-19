import {Component,
        ElementRef,
        Input,
        OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Project} from '../../shared/models/project.model';

/* based on https://bl.ocks.org/mbostock/4339083 */
@Component({
  selector: 'app-collapsible-tree',
  templateUrl: './collapsible-tree.component.html',
  styleUrls: ['./collapsible-tree.component.css']
})
export class CollapsibleTreeComponent implements OnInit {
  @Input()
  project: Project;

  host: any;

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
  }

  ngOnInit() {
    const margin = {top: 10, right: 120, bottom: 10, left: 120};
    const width = 960 - margin.right - margin.left;
    const height = 800 - margin.top - margin.bottom;
    const nodeRadius = 10;
    const duration = 750;
    const data = this.makeGraphData(this.project);
    var root = null;

    data.forEach(n => {
      if(n.type.localeCompare("INPUT") == 0)
        root = n;
    });

    const tree = d3.layout.tree()
                     .size([height, width]);

    const diagonal = d3.svg.diagonal()
                         .projection((d) => [d.y, d.x]);

    const div = this.host.append('div')
                    .attr('class', 'container')
                    .attr('id', 'd3-ctree');

    const tooltipDiv = this.host.append('div')
                           .classed('tooltip', true)
                           .style('opacity', 0);

    const mainSvg = div.append('svg')
                        .attr('id', 'svg-ctree');

    const mainGroup = mainSvg.append('g')
                          .attr('transform', `translate(${margin.left},${margin.top})`);

    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
      if (d.children && d.children.length > 0) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    //root.children.forEach(collapse);
    update(root);

    function update(source) {
      // Compute the new tree layout.
      const nodes = tree.nodes(root);
      const links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach((d) => {
        d.y = d.depth * 180;
      });

      // Update the nodes…
      const node = mainGroup.selectAll('g.node')
                       .data(nodes, (d) => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append('g').attr('class', 'node').attr('transform', () => `translate(${source.y0},${source.x0})`).on('mouseover', (d: Node) => {
                                                                                                                                        showHtmlElem(d, tooltipDiv);
                                                                                                                                      }).on('click', (d) => {
                                                                                                                                          click(d);
                                                                                                                                          hideHtmlElem(tooltipDiv);
                                                                                                                                        }).on('mouseout', () => {
        hideHtmlElem(tooltipDiv);
      });


      nodeEnter.append('circle')
          .attr('r', nodeRadius)
          .style('fill', d => d._children ? 'lightsteelblue' : '#fff');

      nodeEnter.append('text')
          .attr('x', (d) => d.children || d._children ? -15 : 15)
          .attr('dy', '.35em')
          .attr('class', 'tree-text')
          .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
          .text(d => d.title);

      // Transition nodes to their new position.
      const nodeUpdate = node.transition()
                             .duration(duration)
                             .attr('transform', (d) => `translate(${d.y},${d.x})`);

      nodeUpdate.select('circle')
          .attr('r', nodeRadius)
          .style('fill', d => d._children ? 'lightsteelblue' : '#fff');

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition().duration(duration).attr('transform', d => `translate(${source.y},${source.x})`).remove();

      // Fade/shrink a node/text when it is removed(closed, toggle, clicked)
      nodeExit.select('circle')
          .attr('r', nodeRadius / 2);
      nodeExit.select('text')
          .style('fill-opacity', 0);

      // Update the links…
      const link = mainGroup.selectAll('path.link')
                       .data(links, (d: any) => d.target.id);

      // Enter any new links at the parent's previous position.
      link.enter().insert('path', 'g').attr('class', 'link').attr('d', (d: any) => {
        const o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition().duration(duration).attr('d', function(d) {
                                                   const o = {x: source.x, y: source.y};
                                                   return diagonal({source: o, target: o});
                                                 }).remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d: any) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      if (d.children && d.children.length > 0) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      console.log('click');
      update(d);
    }

    function hideHtmlElem(htmlElement) {
      htmlElement.transition()
          .duration(500)
          .style('opacity', 0);
    }

    function showHtmlElem(d, htmlElement) {
      htmlElement.transition()
          .duration(200)
          .style('opacity', .85);
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
    }
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
        children: []
      });
    });

    edges.forEach(e => {
      data[e.source].children.push(data[e.target]);
    })

    return data;
  }
}
