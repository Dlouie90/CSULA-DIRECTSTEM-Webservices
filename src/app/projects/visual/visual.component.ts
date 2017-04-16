import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NodeService} from '../../shared/node.service';
import {Node} from '../../shared/node.model';
import * as d3 from 'd3';

@Component({
  selector   : 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls  : ['./visual.component.css']
})
export class VisualComponent implements OnInit {

  @Input()
  node: Node;

  constructor(private route: ActivatedRoute,
              private nodeService: NodeService,
              private router: Router) { }

  ngOnInit() {
    console.log('alo');
    this.init();
  }

  /****************************************************/
  /****************************************************/
  /****************************************************/

  init(): void {
    this.route.params
        .switchMap((params: Params) => {
          return this.nodeService.getNode(+params['id']);
        })
        .subscribe((node: Node) => {
          if (!node) {
            this.router.navigate(['/projects']);
          }
          this.initTree(node);
          return this.node = node;
        });
  }

  initTree(node: Node): void {
    console.log('tree!');
    const center = 250;
    console.log(center);
    const nodeRadius = 4.5;
    const mainGroup  = d3.select('#d3-tree').append('svg').append('g')
        .attr('transform', `translate(${center},${center})`);

    const cluster = d3.layout.cluster()
        .size([360, center - 50]);

    const nodes = cluster.nodes(node);
    const links = cluster.links(nodes);

    const diagonal = d3.svg.diagonal.radial()
        .projection(function (d) {
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
          d             : diagonal,
          fill          : 'none',
          stroke        : '#ccc',
          'stroke-width': 2
        });

    const nodeGroups = mainGroup.selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', function (d) {
          return `rotate(${d.x - 90})translate(${d.y})`;
        });

    nodeGroups.append('circle')
        .attr({
          r             : nodeRadius,
          fill          : '#fff',
          stroke        : 'steelblue',
          'stroke-width': 3
        });

    nodeGroups.append('text')
        .attr({
          dy           : '.31em',
          'text-anchor': function (d) {
            return d.x < 180 ? 'start' : 'end';
          },
          transform    : function (d) {
            return d.x < 180 ?
                'translate(' + (nodeRadius * 2) + ')' :
                'rotate(180)' +
                'translate(' + (-nodeRadius * 2) + ')';
          }
        })
        .style('font', '12px sans-serif')
        .text(function (d: Node) {
          return `ID:${d.id}`;
        });
  }

}

