// Main function

// Imports
//import { open_side_window } from "./side_window";

// set the dimensions and margins of the graph
var width = 2000;
var height = 2000;
var radius = width/15;
var strength = (-500)*radius;
var fontSize = 50;
// var svg = d3.select("#my_dataviz")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .call(d3.zoom().on("zoom", function () {
//     svg.attr("transform", d3.event.transform)
//  }))
//   .append("g");


// var w = window,
//     d = document,
//     e = d.documentElement,
//     g = d.getElementsByTagName('body')[0],
//     x = w.innerWidth || e.clientWidth || g.clientWidth,
//     y = w.innerHeight|| e.clientHeight|| g.clientHeight;

// append the svg object to the body of the page
// var svg = d3.select("#my_dataviz")
//   .append("svg")
//   .attr("width", x)
//   .attr("height", y)
// //   .call(d3.zoom().on("zoom", function () {
// //     svg.attr("transform", d3.event.transform)
// //  }))
//   .append("g");

// function updateWindow(){
//   x = w.innerWidth || e.clientWidth || g.clientWidth;
//   y = w.innerHeight|| e.clientHeight|| g.clientHeight;

//   svg.attr("width", x).attr("height", y);
// }
// d3.select(window).on('resize.updatesvg', updateWindow);
  
  // Test on responsive size
  var svg = d3.select("#my_dataviz")
  .append("svg")
  // .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + width + " " + height)
  .classed("svg-content-responsive", true)
  .call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
 }))
  .append("g");


d3.json("https://raw.githubusercontent.com/dmilosch/dmilosch.github.io/refs/heads/main/network.json", function(data){

//set up the simulation 
var simulation = d3.forceSimulation()
//add nodes
.nodes(data.nodes);


//add forces
//we're going to add a charge to each node 
//also going to add a centering force
//and a link force
var link_force =  d3.forceLink(data.links)
  .id(function(d) { return d.name; });
simulation
.force("charge_force", d3.forceManyBody().strength(strength))
.force("center_force", d3.forceCenter(width / 2, height / 2))
.force("links",link_force);


//add tick instructions: 
simulation.on("tick", tickActions );

// function nodeColor(d){
// if(d.group=="A"){
// return "red";
// }
// return "green";
// }

function edgeColor(d){
if(d.type == "A"){
return "blue";
}
if(d.type == "B"){
return "red";
}
return "green";
}

// Returning the label
function nodeLabel(d){return d.label}

const arrow = d3.arrow1()
    .id("my-arrow")
    .attr("fill", "steelblue")
    .attr("stroke", "steelblue");
 
svg.call(arrow);

// Layers - Created in their order from behind to the front
var layer1 = svg.append("g");
var layer2 = svg.append("g");


// //draw circles for the links
var node = layer2.attr("class", "nodes")
.selectAll("circle")
.data(data.nodes)
.enter()
.append("g");


// //draw lines for the links 
// var link = layer1.attr("class", "links")
// .selectAll(".links")
// .data(data.links)
// .enter()
// .append("line")
// .attr("stroke-width", 2)
// .style("stroke",edgeColor)
// .attr("marker-end", "url(#my-arrow)");

var link = layer1.attr("class", "links")
.selectAll(".links")
.data(data.links)
.enter()
.append("polyline")
.attr("stroke-width", 2)
.style("stroke",edgeColor)
.attr("marker-mid", "url(#my-arrow)")
.attr("points",get_points);

function get_points(d) { 
  // console.log(d);
  // console.log(d.source.x);
  return [
       d.source.x, d.source.y,
       d.source.x/2+d.target.x/2, d.source.y/2+d.target.y/2,
       d.target.x, d.target.y
  ].join(',');
}; 

// Adding the line
// link

// Adding the circle
node.append("circle")
.attr("r", radius)
.attr("fill", "#0B192C");
//.style("stroke", "red")

// Adding a label on the circle
node.append('text')
.text(nodeLabel)
.attr("text-anchor", "middle")
.style("fill", "#FF6500")
.style("font-size", fontSize)
.attr("dy", (fontSize)/2);


var drag_handler = d3.drag()
.on("start", drag_start)
.on("drag", drag_drag)
.on("end", drag_end);	

drag_handler(node)

// //drag handler
// //d is the node 
function drag_start(d) {
if (!d3.event.active) simulation.alphaTarget(0.3).restart();
d.fx = d.x;
d.fy = d.y;
}

function drag_drag(d) {
d.fx = d3.event.x;
d.fy = d3.event.y;
}


function drag_end(d) {
if (!d3.event.active) simulation.alphaTarget(0);
d.fx = null;
d.fy = null;
}

function tickActions() {
  node.attr('transform', d => `translate(${d.x},${d.y})`);
  link.attr("points", function(d) {
    // Ensure the positions are updated during each tick
    return [
        d.source.x, d.source.y,
        (d.source.x + d.target.x) / 2, (d.source.y + d.target.y) / 2,  // mid-point for the curve
        d.target.x, d.target.y
    ].join(',')});
}

// Testing lines

// svg.append("polyline")
//     .attr("marker-mid", "url(#my-arrow)")
//     .attr("points", [[5, 10],[25,10] ,[55, 10]])
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 2);


// Clicking events
node.on("dblclick", open_side_window);

// Javascript file which creates a sidewindow
function open_side_window(d){
  console.log(d);
}

});
