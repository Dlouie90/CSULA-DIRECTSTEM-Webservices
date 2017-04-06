import {Component, Input, OnInit} from '@angular/core';
import {Webservice} from '../../shared/webservice.model';
import {WebserviceService} from '../../shared/webservice.service';
import {ActivatedRoute, Params} from '@angular/router';
import * as d3 from 'd3';
import {Graph} from '../../shared/graph.model';
import {Node} from '../../shared/node.model';

@Component({
  selector   : 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls  : ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit {
  @Input()
  webservice: Webservice;

  editMode: boolean;

  constructor(private service: WebserviceService,
              private route: ActivatedRoute) {

    this.editMode = false;
  }

  ngOnInit(): void {
    this.getWebservice();
    this.graph();
    /* Scroll to the top after switching view*/
    window.scroll(0, 0);
  }

  getWebservice(): void {
    this.route.params
        .switchMap((params: Params) => {
          return this.service.getWebservice(+params['id']);
        })
        .subscribe((ws: Webservice) => {
          return this.webservice = ws;
        });
  }

  graph(): void {
    const svg = d3.select('div#d3-graph')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '650px')
        .style('border', 'thin lightgrey solid');

    const nodes: Node[] = Graph.defaultState.nodes;
    const g             = new Graph(svg, nodes);
    g.updateGraph();
  }
}

