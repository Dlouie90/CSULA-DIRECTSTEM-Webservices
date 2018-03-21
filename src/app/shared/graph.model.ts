import * as d3 from 'd3';
import {Project} from './models/project.model';
import {ProjectService} from './services/project.service'
import {Node} from './models/node.model';
import {Edge} from './models/edge.model';
import {View} from './view.model';

const final = {
  /* --------------- NODE CONSTANTS --------------- */
  NODE_RADIUS: 50,

  /* --------------- KEY CODES --------------- */
  BACK_SPACE_KEY: 8,
  DELETE_KEY: 46,

  /* ---------------  CSS CLASS --------------- */
  /*
   | CSS file located in /src/assets/css
   */
  CONNECTED_NODE_CLASS:          'connect-node',
  NODE_CLASS:                    'node',
  NODE_SELECTED_CLASS:           'node-selected',
  NODE_COMPOSITE_CLASS:          'node-composite',
  NODE_COMPOSITE_SELECTED_CLASS: 'node-composite-selected',
  NODE_INPUT_CLASS:              'node-input',
  NODE_INPUT_SELECTED_CLASS:     'node-input-selected',
  NODE_OUTPUT_CLASS:             'node-output',
  NODE_OUTPUT_SELECTED_CLASS:    'node-output-selected',
  GRAPH_CLASS:                   'graph',
  CLICKED_NODE:                  'clicked-node'
};

export class Graph {
  svg: any;
  nodes: Node[];
  edges;
  paths;
  circles;
  svgG;
  dragLine;
  drag;
  stack;
  parentNode;
  state;
  project;
  projectService;
  dragged;

  constructor(svgIn: any, nodes: Node[], edges: Edge[], project: Project, projectService: ProjectService) {
    // for clarity: typing this over and over can be confusing
    const thisGraph = this;

    // Display edges only if it is a "composition view", if parentNode exist.
    // If no parentNode exist, we only want to display the node as a independent
    // node. nodesIn should only contain 1 element if no parentNode exist.
    // const nodeEdgeData = parentNode ? parseData(nodesIn) : {edges: [], nodes: nodesIn};
    const nodeEdgeData = {edges: edges, nodes: nodes};

    /* *** Graph variables *** */
    this.svg = svgIn;
    this.nodes = nodeEdgeData.nodes || [];
    this.edges = nodeEdgeData.edges || [];
    this.stack = [];
    //this.parentNode = parentNode;
    this.parentNode = [];
    this.project = project; // for callbacks
    this.projectService = projectService;

    this.dragged = false;

    // View of the graph (selected nodes, links, etc..)
    this.state = {
      selectedNode: null,
      clickNodes: [],
      selectedEdge: null,
      mouseDownNode: null,
      shiftNodeDrag: false,
      graphMouseDown: false
    };

    /* these two element are used to create the link/edges used in this graph */
    // define arrow markers for graph links
    const defs = svgIn.append('svg:defs');
    defs.append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', '42')
        .attr('markerWidth', 4.0)
        .attr('markerHeight', 4.5)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');

    // define arrow markers for leading arrow
    defs.append('svg:marker')
        .attr('id', 'mark-end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 7)
        .attr('markerWidth', 3.5)
        .attr('markerHeight', 3.5)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');

    // the main container for all <circle> <path> elements
    thisGraph.svgG = svgIn.append('g')
                         .classed(final.GRAPH_CLASS, true);

    // For convenience (typing thisGraph.svgG is tedious)
    const svgG = thisGraph.svgG;

    // displayed when dragging between nodes
    this.dragLine = svgG.append('svg:path')
                        .attr('class', 'link dragline hidden')
                        .attr('d', 'M0,0L0,0')
                        .style('marker-end', 'url(#mark-end-arrow)');

    // a Selection of all <g> in the graph for <paths>
    thisGraph.paths = svgG.append('g').attr('class', 'pathG').selectAll('g');

    // a Selection of all <g> in the graph for <circle>
    thisGraph.circles = svgG.append('g').attr('class', 'circleG').selectAll('g');

    // Define Graph drag behavior
    thisGraph.drag = d3.behavior.drag()
                         .origin(function(d: any) {
                           return {x: d.x, y: d.y};
                         })
                         .on('drag', function(args) {
                           thisGraph.dragmove.call(thisGraph, args);
                         });

    // insert a new node based on the cursor's location
    svgIn.on('mousedown', function(d) {
      thisGraph.svgMouseDown.call(thisGraph, d);
    });
    svgIn.on('mouseup', function(d) {
      thisGraph.svgMouseUp.call(thisGraph, d);
    });
  }

  /**
   * Drag the node or, if the shift key is held, drag the "drag line"
   */
  dragmove = function(d) {
    const thisGraph = this;
    if (thisGraph.state.shiftNodeDrag) {
      thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(this.svgG.node())[1]);
    } else {
      this.dragged = true;
      d.x += (d3.event as any).dx;
      d.y += (d3.event as any).dy;
      thisGraph.updateGraph();
    }
  };

  get clickNodes(): Array<Node> {
    return this.state.clickNodes;
  }

  set clickNodes(nodes: Array<Node>) {
    this.state.clickNodes = nodes;
  }

  /** Register a node as a "clicked node", if the node is already
   * registered, then un-register it (remove click). */
  toggleClickNodes(node: Node): void {
    const index = this.clickNodes.findIndex((n: Node) => n.id === node.id);
    if (index === -1) {
      this.clickNodes.push(node);
    } else {
      this.clickNodes.splice(index, 1);
    }
    this.updateGraph();
  }

  /** Toggle the path/link/edge selected css.
   *  If edge is highlighted, then un-highlight it, if it is not, un-highlight
   *  all the other edges and highlight the current click one
   */
  pathMouseDown(d3path, link) {
    /* Don't toggle highlight if it is a right click */
    if ((d3.event as any).which === 3) {
      return;
    }
    const thisGraph = this;
    const state = thisGraph.state;
    const prevEdge = state.selectedEdge;

    (d3.event as any).stopPropagation();

    // Un-highlight selectedNode: we only want on thing (edge or node) to be
    // highlighted at a time.
    if (state.selectedNode) {
      thisGraph.removeSelectFromNode();
    }

    // updateToService the state: this is the selected link
    state.mouseDownLink = link;

    if (!prevEdge || prevEdge !== link) {
      thisGraph.replaceSelectEdge(d3path, link);
    } else {
      thisGraph.removeSelectFromEdge();
    }
  };

  makeNodeInput(node) {
    console.log("MAKING CURRENT NODE INPUT");

    this.nodes.forEach(n => {
      if(n.type.localeCompare("INPUT") == 0)
        n.type = "REGULAR";
      if(n.id == node.id)
        n.type = "INPUT";
    })
  }

  makeNodeOutput(node) {
    console.log("MAKING CURRENT NODE OUTPUT");

    this.nodes.forEach(n => {
      if(n.type.localeCompare("OUTPUT") == 0)
        n.type = "REGULAR";
      if(n.id == node.id)
        n.type = "OUTPUT";
    })
  }

  /** Highlight a path. And if there is a path that is already highlighted,
   * then un-highlight it.
   */
  replaceSelectEdge(d3Path, edgeData) {
    const thisGraph = this;
    d3Path.classed(final.NODE_SELECTED_CLASS, true);

    // un-highlight the previous edge if there is one
    if (thisGraph.state.selectedEdge) {
      thisGraph.removeSelectFromEdge();
    }
    thisGraph.state.selectedEdge = edgeData;
  };

  /** Remove the select highlighting css from the selectedEdge
   */
  removeSelectFromEdge = function() {
    const thisGraph = this;

    // Find the path that is the selectedEdge (should be only 1) and remove
    // the selected highlighting css
    thisGraph.paths.filter(function(cd) {
                     return cd === thisGraph.state.selectedEdge;
                   })
        .classed(final.NODE_SELECTED_CLASS, false);

    // reset the state
    thisGraph.state.selectedEdge = null;
  };


  /* =============== PROTOTYPE NODE/CIRCLE FUNCTIONS =============== */

  /**
   * Reposition the "drag line" when the user hold shift and drag
   * The "drag line" is used to create an Edge when it connects with another node.
   */
  circleMouseDown(d3node, d) {
    const thisGraph = this;
    const state = thisGraph.state;

    (d3.event as any).stopPropagation();

    state.mouseDownNode = d;

    if ((d3.event as any).shiftKey) {
      state.shiftNodeDrag = (d3.event as any).shiftKey;
      thisGraph.dragLine.classed('hidden', false)
          .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
    }
  }

  /**
   * Insert an edge into a graph if it "connects" to a node
   */
  circleMouseUp(d3node, d) {
    /* ignore right click events */
    if ((d3.event as any).which === 3) {
      return;
    }

    const thisGraph = this;
    const state = thisGraph.state;

    // reset the states
    state.shiftNodeDrag = false;
    d3node.classed(final.CONNECTED_NODE_CLASS, false);

    const mouseDownNode = state.mouseDownNode;

    if (!mouseDownNode) {
      return;
    }

    thisGraph.dragLine.classed('hidden', true);

    if (mouseDownNode !== d) {
      // we're in a different node: create new edge for mousedown edge and add to graph
      var source_index = this.nodes.findIndex((n: Node) => n.id == mouseDownNode.id);
      var target_index = this.nodes.findIndex((n: Node) => n.id == d.id);
      const newEdge = {source: source_index, target: target_index};

      // Get all the edges from the graph that is the same as newEdge
      const filtRes = thisGraph.paths.filter(function(_d) {

        // // if the reversed edge exist (a->b & b->a), replace the previous one
        // if (d.source === newEdge.target && d.target === newEdge.source) {
        //     thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1);
        // }

        return _d.source == newEdge.source && _d.target == newEdge.target;
      });

      // if the edge is not a duplicate, add it to the graph
      if (!filtRes[0].length) {
        // mouseDownNode.neighbors.push(d);
        thisGraph.edges.push(newEdge);
        thisGraph.updateGraph();

        // callback to the project and try to update/save it with the new edge
        this.projectService.updateProjectToService(this.project);
      }

    } else {
      // we're in the same node
      if (state.selectedEdge) {
        thisGraph.removeSelectFromEdge();
      }
      const prevNode = state.selectedNode;

      if (!prevNode || prevNode.id !== d.id) {
        thisGraph.replaceSelectNode(d3node, d);
      } else {
        thisGraph.removeSelectFromNode();
      }

      if(this.dragged) {
        this.dragged = false;

        // callback to the project and try to update/save it
        this.projectService.updateProjectToService(this.project);
      }
    }

    state.mouseDownNode = null;
  }

  updateSelectedNodeTime(time, node) {
    if(node == null) // what???
      return;

    console.log("UPDATING NODE TIME");
    var index = this.nodes.findIndex((n: Node) => n.id == node.id);
    this.nodes[index].time_text = time.toFixed(2) + "ms";
    this.nodes[index].just_benchmarked = true;

    var d = new Date();
    var date = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

    if(this.nodes[index].stats == null)
      this.nodes[index].stats = [];
    this.nodes[index].stats.push({date: date, runtime: time});

    // callback to the project and try to update/save it
    this.projectService.updateProjectToService(this.project);

    this.updateGraph();
  }

  findSelectedNodeNeighbors(node) {
    if(node == null) // huh?
      return [];

    console.log("FINDING NODE NEIGHBORS");
    var node_indices = [];

    this.edges.forEach(edge => {
      if(this.nodes[edge.target].id == node.id) {
        node_indices.push(edge.source);
      }
    });

    return node_indices;
  }

  /** Remove all the edges associated with a node.
   *  Used after a node is deleted to delete all the edges connected to it. */
  spliceLinksFormNode(node) {
    const thisGraph = this;

    /* Get a list of all the edges to removed. */
    const toSplice = thisGraph.edges.filter(edge => {
      return (edge.source.id === node.id || edge.target.id === node.id);
    });

    /* remove each edges from the graph. */
    toSplice.forEach(edge => {
      thisGraph.edges.splice(thisGraph.edges.indexOf(edge), 1);
    });
  }


  replaceSelectNode(d3Node, nodeData) {
    const thisGraph = this;

    console.log("replacing select on node");

    if(nodeData.composite_id == null) {
      console.log("REGULAR NODE")
      if(nodeData.type.localeCompare("REGULAR") == 0)
        d3Node.classed(final.NODE_SELECTED_CLASS, true);
      else if(nodeData.type.localeCompare("INPUT") == 0)
        d3Node.classed(final.NODE_INPUT_SELECTED_CLASS, true);
      else if(nodeData.type.localeCompare("OUTPUT") == 0)
        d3Node.classed(final.NODE_OUTPUT_SELECTED_CLASS, true);
    }
    else {
      console.log("COMPOSITE NODE");
      d3Node.classed(final.NODE_COMPOSITE_SELECTED_CLASS, true);
    }

    this.selectNode(nodeData);
  }

  selectNode(node) {
    const thisGraph = this;

    if (thisGraph.state.selectedNode) {
      thisGraph.removeSelectFromNode();
    }
    thisGraph.state.selectedNode = node;
  }

  removeSelectFromNode() {
    const thisGraph = this;

    thisGraph.circles.filter(function(cd) {
                       return cd.id === thisGraph.state.selectedNode.id && cd.composite_id == null && cd.type.localeCompare("REGULAR") == 0;
                     })
        .classed(final.NODE_SELECTED_CLASS, false);
    thisGraph.circles.filter(function(cd) {
                       return cd.id === thisGraph.state.selectedNode.id && cd.composite_id == null && cd.type.localeCompare("INPUT") == 0;
                     })
        .classed(final.NODE_INPUT_SELECTED_CLASS, false);
    thisGraph.circles.filter(function(cd) {
                       return cd.id === thisGraph.state.selectedNode.id && cd.composite_id == null && cd.type.localeCompare("OUTPUT") == 0;
                     })
        .classed(final.NODE_OUTPUT_SELECTED_CLASS, false);
    thisGraph.circles.filter(function(d) {
                       return d.id === thisGraph.state.selectedNode.id && d.composite_id != null;
                     })
        .classed(final.NODE_COMPOSITE_SELECTED_CLASS, false);

    thisGraph.state.selectedNode = null;
  }

  /* =============== PROTOTYPE SVG FUNCTIONS =============== */


  removeSelectedNode(): void {
    const thisGraph = this;
    const state = thisGraph.state;

    const node = state.selectedNode;

    /* Can only delete selected node that are not an input/output node. */
    if (node) {
      /* Remove the node form the list. */
      var node_index = thisGraph.nodes.indexOf(node);
      thisGraph.removeEdgesWithNodeIndex(node_index);
      thisGraph.nodes.splice(node_index, 1);
      /* Remove all edges originating from this node. */
      //thisGraph.removeEdgesWithNode(node);
      //thisGraph.spliceLinksFormNode(selectedNode);
      /* Remove the node from all neighbors field */
      //this.removeFromNeighbor(selectedNode);
      thisGraph.state.selectedNode = null;
      thisGraph.updateGraph();

      // callback to the project and try to update/save it
      this.projectService.updateProjectToService(this.project);
    }
  }

  removeEdgesWithNodeIndex(node_index) {
    console.log("Removing edges with node index");
    if (node_index > -1) {
      const to_purge = this.edges.filter(edge => edge.source == node_index || edge.target == node_index);
      to_purge.forEach(edge => {
        var edge_index = this.edges.indexOf(edge);
        this.edges.splice(edge_index, 1);
        //this.paths.splice(edge_index, 1);
      });
      console.log("Purged " + to_purge.length + " edges");

      // properly update indices to account for the node being gone
      const to_update = this.edges.filter(edge => edge.source > node_index || edge.target > node_index);
      to_update.forEach(edge => {
        if(edge.source > node_index) edge.source--;
        if(edge.target > node_index) edge.target--;
      })
    }
    console.log("There are " + this.edges.length + " edges remaining");
  }

  removeSelectedEdge(): void {
    const thisGraph = this;
    const state = thisGraph.state;

    const selectedEdge = state.selectedEdge;

    if (selectedEdge) {
      /* Remove the edge from the edge list */
      thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);

      /* Remove the edge from the node list too. */
      this.removeEdge(thisGraph.nodes, selectedEdge);

      state.selectedEdge = null;
      thisGraph.updateGraph();
    }
  }

  /** Remove the edges from the nodes list. An edge exist between a node
   * and its neighbor's node. */
  removeEdge(nodes, edge) {
    /* This is the source node that is in the nodes array. */
    const node = nodes.filter(currentNode => {
      return currentNode.id === edge.source.id;
    })[0];

    /* Remove the target node from the node neighbors field. */
    /*
    node.neighbors = node.neighbors.filter(currentNode => {
      return currentNode.id !== edge.target.id;
    });
    */
  }

  /** Remove the nodeToRemove from all nodes.neighbor field */
  /*
  removeFromNeighbor(nodeToRemove) {
    this.nodes.forEach(node => {
      node.neighbors.forEach((neighbor, index) => {
        if (neighbor.id === nodeToRemove.id) {
          node.neighbors.splice(index, 1);
        }
      });
    });
  }
  */

  /*
  removeNonClickNeighbors(): void {
    this.clickNodes.forEach((n: Node) => {
      n.neighbors.forEach((neighbor, index) => {
        if (!this.isClickNode(neighbor)) {
          n.neighbors.splice(index, 1);
        }
      });
    });
  }
  */

  /*
  removeNeighborsToClickNodes(): void {
    this.nodes.forEach((n: Node) => {
      n.neighbors.forEach((neighbor, index) => {
        if (!this.isClickNode(n) && this.isClickNode(neighbor)) {
          n.neighbors.splice(index, 1);
        }
      });
    });
  }
  */

  isClickNode(node: Node): boolean {
    return this.clickNodes.findIndex((n: Node) => n.id === node.id) !== -1;
  }

  // mousedown on main svg
  svgMouseDown = function() {
    this.state.graphMouseDown = true;
  };

  /**
   * Insert node into the graph when the user have the shift key head down and
   * click on the graph
   */
  svgMouseUp() {
    const thisGraph = this;
    const state = thisGraph.state;

    if (state.shiftNodeDrag) {
      // hide the "drag line": the line that display when you are trying
      // to connect an edge to a node
      state.shiftNodeDrag = false;
      thisGraph.dragLine.classed('hidden', true);
    }
    state.graphMouseDown = false;
  }

  /** Used for angular 2 to insert a node*/
  insertNode(node: Node) {
    if(this.nodes.findIndex((n: Node) => n.id == node.id) == -1)
      this.nodes.push(node);
    this.updateGraph();
  }


  /* =============== MISCELLANEOUS  PROTOTYPE FUNCTIONS =============== */
  /**
   * Return a copy of the state of the graph. Can be used to repopulate the
   * the state of the graph.
   */
  get currentView(): View {
    const nodes = this.nodes.map(node => {
      return this.copyObject(node);
    });

    return new View([this.project], this.project);
  }


  /** Copy and return the copy. */
  copyObject(object) {
    return JSON.parse(JSON.stringify(object));
  }


  /* =============== MAIN FUNCTION  =============== */

  /**
   * Update the Graph. Draw/Redraw the graph.
   */
  updateGraph() {
    // for convinces
    const thisGraph = this;
    const state = this.state;
    const nodes = this.nodes;

    // update the paths : paths = ...selectAll("g")
    thisGraph.paths = thisGraph.paths
                          .data(thisGraph.edges, function(d) {
                            return d.source + '+' + d.target;
                          });

    // For convinces: the updateToService selection
    const paths = thisGraph.paths;

    // Update existing paths (notice no enter() or exit())
    paths.style('marker-end', 'url(#end-arrow)')
        .classed(final.NODE_SELECTED_CLASS, function(d) {
          return d === state.selectedEdge;
        })
        .attr('d', function(d) {
          // fixes updating edges when node is being dragged
          return 'M' + nodes[d.source].x + ',' + nodes[d.source].y + 'L' + nodes[d.target].x + ',' + nodes[d.target].y;
        });

    // Add new paths: the enter selection
    paths.enter()
        .append('path')
        .style('marker-end', 'url(#end-arrow)')
        .classed('link', true)
        .attr('d', function(d) {
          // fixes updating edges when node is being dragged
          return 'M' + nodes[d.source].x + ',' + nodes[d.source].y + 'L' + nodes[d.target].x + ',' + nodes[d.target].y;
        })
        .on('mousedown', function(d) {
          thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
        });


    // remove old links: the exit selection
    paths.exit().remove();

    // update the circle selection
    thisGraph.circles = thisGraph.circles
                            .data(nodes, function(d) {
                              return String(d.id);
                            });

    // update all current circles on the graph
    thisGraph.circles
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });
        // Enable/disable clickNodes css
        /*
        .classed(final.CLICKED_NODE, function(d) {
          return thisGraph.clickNodes.findIndex((n: Node) => n.id === d.id) !== -1;
        });
        */

    // update the current subtitle of all nodes that have just been benchmarked
    thisGraph.circles
             .selectAll("text")
             .forEach(t => {
                // uncomment the line below if you end up adding more texts to the node
                //var updateC = t[t.findIndex(b => b.id == "subtitle")];
                // TODO: hard-coding is BAD! Need to optimize the routine above.
                var updateC = t[1];
                var updateN = nodes[nodes.findIndex(n => n.id == updateC.__data__.id)];
                if(updateN.just_benchmarked) {
                  updateC.textContent = "(" + updateN.time_text + ")";
                  updateN.just_benchmarked = false;
                }
              });

    // add new circles to the graph(they are wrapped in <g>)
    const newGs = thisGraph.circles.enter()
                      .append('g');

    newGs.classed(final.NODE_CLASS, true)
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        })
        .classed(final.NODE_COMPOSITE_CLASS, function(d) {
          return d.composite_id != null;
        })
        .classed(final.NODE_INPUT_CLASS, function(d) {
          return d.type.localeCompare("INPUT") == 0;
        })
        .classed(final.NODE_OUTPUT_CLASS, function(d) {
          return d.type.localeCompare("OUTPUT") == 0;
        })
        .on('click', function(d: Node) {
          thisGraph.toggleClickNodes(d);
        })
        .on('mouseover', function(d) {
          if (state.shiftNodeDrag) {
            d3.select(this).classed(final.CONNECTED_NODE_CLASS, true);
          }
        })
        .on('mouseout', function(d) {
          d3.select(this).classed(final.CONNECTED_NODE_CLASS, false);
        })
        .on('mousedown', function(d) {
          thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
        })
        .on('mouseup', function(d) {
          thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
        })
        .call(thisGraph.drag);

    newGs.append('circle')
        .attr('r', 0)
        .transition()
        .attr('r', String(final.NODE_RADIUS));

    newGs.append('text')
        .attr('text-anchor', 'middle')
        .text(function(d) {
          return Node.nodeTitle(d);
        });
    newGs.append('text')
        .classed('children', true)
        .attr('id', 'subtitle')
        .attr('text-anchor', 'middle')
        .attr('y', 30)
        .text(d => {
          if (d.time_text != null && d.time_text.length > 0) {
            return `(${d.time_text})`;
          }
        });

    // remove old nodes;
    thisGraph.circles.exit().remove();
  };
}


/** Given a list nodes, return an object with the nodes and its edges.
 * Each node will be "clone". */
function parseData(nodeArray) {
  /*   Need to clone for d3.js to work properly.
   *  Javascript and d3.js equate object based on their memory location(?).
   *  But because we identify and organize our node based on ID, some node
   *  may not be == the same to d3.js even though they have the same id.
   *  (This is because we save, load, and reload our nodes).
   *  The solution to this is to clone all the nodes here before we work on
   *  them. If we don't clone, when we move some node, d3.js won't see the
   *  the change in x y pos because he is still looking at the memory location. */
  const nodes = nodeArray.map(node => JSON.parse(JSON.stringify(node)));
  const edges = [];

  for (const node of nodes) {
    for (const neighbor of node.neighbors) {
      edges.push({
        source: node,
        /* Same reasoning as above. We want to ensure the neighbor node
         * is the same node in memory as the node in the nodes array. */
        target: findNeighbor(nodes, neighbor)
      });
    }
  }
  return {nodes: nodes, edges: edges};
}

/** Return the node with the same id as the neighbor in the nodes array. */
function findNeighbor(nodes: Node[], neighbor: Node) {
  for (const node of nodes) {
    if (node.id === neighbor.id) {
      return node;
    }
  }
}
