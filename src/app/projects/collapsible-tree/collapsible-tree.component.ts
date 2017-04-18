import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {NodeService} from '../../shared/node.service';
import {NodeUtility} from '../../shared/node-utility.model';

/* based on https://bl.ocks.org/mbostock/4339083 */
@Component({
  selector   : 'app-collapsible-tree',
  templateUrl: './collapsible-tree.component.html',
  styleUrls  : ['./collapsible-tree.component.css']
})
export class CollapsibleTreeComponent implements OnInit {


  constructor(private nodeService: NodeService) {}


  ngOnInit() {
    this.nodeService.getNode(3)
        .then(data => {
          const margin = {top: 20, right: 120, bottom: 20, left: 120},
                width  = 960 - margin.right - margin.left,
                height = 800 - margin.top - margin.bottom;

          let i          = 0;
          const duration = 750;
          let root;

          const tree = d3.layout.tree()
              .size([height, width]);

          const diagonal = d3.svg.diagonal()
              .projection(function (d) { return [d.y, d.x]; });

          const svg = d3.select('div#d3-ctree').append('svg')
              .attr('width', width + margin.right + margin.left)
              .attr('height', height + margin.top + margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


          root    = data;
          root.x0 = height / 2;
          root.y0 = 0;

          function collapse(d) {
            if (d.children && d.children.length > 0) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
            }
          }

          root.children.forEach(collapse);
          update(root);

          d3.select(self.frameElement).style('height', '800px');

          function update(source) {

            // Compute the new tree layout.
            const nodes = tree.nodes(root).reverse(),
                  links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function (d) { d.y = d.depth * 180; });

            // Update the nodes…
            const node = svg.selectAll('g.node')
                .data(nodes, function (d: any) { return d.id || (d.id = ++i); });

            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', function (d) { return 'translate(' + source.y0 + ',' + source.x0 + ')'; })
                .on('click', click);

            nodeEnter.append('circle')
                .attr('r', 1e-6)
                .style('fill', function (d) { return d._children ? 'lightsteelblue' : '#fff'; });

            nodeEnter.append('text')
                .attr('x', function (d) { return d.children || d._children ? -10 : 10; })
                .attr('dy', '.35em')
                .attr('text-anchor', function (d) { return d.children || d._children ? 'end' : 'start'; })
                .text(function (d) {
                      return NodeUtility.title(d);
                    }
                )
                .style('fill-opacity', 1e-6);

            // Transition nodes to their new position.
            const nodeUpdate = node.transition()
                .duration(duration)
                .attr('transform', function (d) { return 'translate(' + d.y + ',' + d.x + ')'; });

            nodeUpdate.select('circle')
                .attr('r', 4.5)
                .style('fill', function (d) { return d._children ? 'lightsteelblue' : '#fff'; });

            nodeUpdate.select('text')
                .style('fill-opacity', 1);

            // Transition exiting nodes to the parent's new position.
            const nodeExit = node.exit().transition()
                .duration(duration)
                .attr('transform', function (d) { return 'translate(' + source.y + ',' + source.x + ')'; })
                .remove();

            nodeExit.select('circle')
                .attr('r', 1e-6);

            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // Update the links…
            const link = svg.selectAll('path.link')
                .data(links, function (d: any) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', function (d) {
                  const o = {x: source.x0, y: source.y0};
                  return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr('d', diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr('d', function (d) {
                  const o = {x: source.x, y: source.y};
                  return diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d: any) {
              d.x0 = d.x;
              d.y0 = d.y;
            });
          }

          // Toggle children on click.
          function click(d) {
            if (d.children && d.children.length > 0) {
              d._children = d.children;
              d.children  = null;
            } else {
              d.children  = d._children;
              d._children = null;
            }
            console.log('click');
            update(d);
          }
        });
  }
}
