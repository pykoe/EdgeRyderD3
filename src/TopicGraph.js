
import React, { Component } from 'react'
import * as d3 from 'd3'


class TopicGraph extends Component {

    componentDidMount() {
        this.drawGraph();
    }

    drawGraph() {

        //console.log(this.props.data)

        const data = this.props.data.graph;

        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 30, left: 40},
          width = this.props.width - margin.left - margin.right,
          height = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("body")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    `translate(${margin.left}, ${margin.top})`);
        //console.log(data);

      console.log(data)


    const nodesLabel = data.properties.viewLabel.nodesValues;
    const nodesColor = data.properties.viewColor.nodesValues;
    const nodesSize = data.properties.viewSize.nodesValues;
    const nodesLayout = data.properties.viewLayout.nodesValues;

    var nbNodes = 69;
    var nodes = [...Array(nbNodes).keys()];;

    // build nodes properties from tulip json file
    const nodesProperties = [];
    for (var nodeId=0; nodeId<nbNodes; nodeId++) {
        const node = {};
        node['id'] = nodeId;

        var layoutTuple = nodesLayout[nodeId];
        var string = layoutTuple.replace(/\(/g, "[").replace(/\)/g, "]");
        var layoutArray = JSON.parse(string);
        node['x'] = parseFloat(layoutArray[0])*2 - width/4;
        node['y'] = parseFloat(layoutArray[1])*2 - height/4;

        // node.style.color = "rgb(155, 102, 102)" ;
        var colorTuple = nodesColor[nodeId];
        var string = colorTuple.replace(/\(/g, "[").replace(/\)/g, "]");
        var colorArray = JSON.parse(string);
        const color = d3.rgb(colorArray[0], colorArray[1], colorArray[2]);
        node['color'] = color;

        var sizeTuple = nodesSize[nodeId];
        var string = sizeTuple.replace(/\(/g, "[").replace(/\)/g, "]");
        var sizeArray = JSON.parse(string);
        node['size'] = sizeArray[0];

        node['label'] = nodesLabel[nodeId];
        nodesProperties[nodeId] = node;
    }
      const xs = nodesProperties.map(x => x['x']);
      const xextend = d3.extent(xs);
      const x = d3.scaleLinear(xextend, [0, width]);

      const ys = nodesProperties.map(x => x['y']);
      const yextend = d3.extent(ys);
      const y = d3.scaleLinear(yextend, [0, height]);

      // Initialize the links
      const link = svg
        .selectAll("line")
        .data(data.edges)
        .join("line")
          .style("stroke", "#aaa")
          .attr("x1", function(d) {
            return x(nodesProperties[d[0]]['x']);
          })
          .attr("y1", function(d) {
            return y(nodesProperties[d[0]]['y']);
          })
          .attr("x2", function(d) {
            return x(nodesProperties[d[1]]['x']);
          })
          .attr("y2", function(d) {
            return y(nodesProperties[d[1]]['y']);
          });

    // Initialize the nodes
    const node = svg
        .selectAll("circle")
        .data(nodes)
        .join("circle")

          .attr("r", function (d) {
             return nodesProperties[d]['size'];
            })
          .style("fill", function(d) {
            return nodesProperties[d]['color'];

            })
          .attr("cx", function (d) {
            return x(nodesProperties[d]["x"]);
           })
          .attr("cy", function(d) {
            return y(nodesProperties[d]["y"]);
          })

    node.append("title")
      .text(function(d) { return nodesProperties[d]['label'];  });


        var text = svg.append("g")
            .attr("class", "labels")
          .selectAll("text")
            .data(nodes)
          .enter().append("text")
            .attr("x", function (d) {
               return x(nodesProperties[d]["x"]);
             })
              .attr("y", function(d) {
                return y(nodesProperties[d]["y"]);
              })
            .attr("dx", 8)
            .attr("dy", ".35em")
            .text(function(d) { return nodesProperties[d]['label'].substring(0, 6); });


            }

    render() {
        return <div id={"#" + this.props.id}></div>
    }
}

export default TopicGraph;