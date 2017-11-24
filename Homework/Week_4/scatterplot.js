/*
	Jesse Emmelot
	11963522
	
	This scatterplot shows the ratios between the population of a country 
	and the amount of Olympic summer medals they have obtained since 1896.
	Since population numbers as well as medal amounts differ by so much, 
	logarithmic scales have been used on both axis, to achieve a more even 
	spread of dots.
*/	

// define spacial properties
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// scaling on the x-axis	
var x = d3.scale.log()
	.domain([64237, 1347350000])
    .range([0, width]);

// scaling on the y-axis 	
var y = d3.scale.log()
	.domain([1, 2522])
    .range([height, 0]);

// scaling on the color of the dots	
var color = d3.scale.log()
	.domain([17485, 44338998])
	.range([0, 300])

// x-axis properties	
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
	.ticks(0, "1s");

// y-axis properties
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(0, "1s");

// tooltip properties	
var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-12, 0])
	.html(function(d) {
	return 	"<strong>Country:</strong> <span>" + d.Country + "<br>" + 
			"<strong>Medals:</strong> <span>" + d.Medals + "<br>" +
			"<strong>Population:</strong> <span>" + d.Population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>";
	})	

// color spectrum of the legend 	
var colors = [{color:"red"}, {color:"yellow"}]	

// legend dimensions
var legend_width = 200,
	legend_height = 50;

// scaling of the svg	
var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")	
	.append("text")
	.attr("class", "label")
	.attr("font-size", "25px")
	.attr("x", width/2)
	.attr("y", margin.top)
	.attr("text-anchor", "middle")
	.text("Population per Olympic medal count");	
	
// add gradient parameters
svg.append("defs")
	.append("linearGradient")
	.attr("id", "grad")
	.attr("x1", "0%")
	.attr("x2", "100%")
	.attr("y1", "0%")
	.attr("y2", "0%")
	.selectAll("stop")
	.data(colors)
	.enter()
	.append("stop")
	.attr("offset", function(d, i) {
		return (i / colors.length) * 130 + "%";
	})
	.style("stop-color", function(d) {
		return d.color;
	})
	

// draw and fill the legend	
svg.append("rect")
	.attr("x", 0)
	.attr("y", -75)
	.attr("width", legend_width)
	.attr("height", legend_height / 2)
	.attr("fill", "url(#grad)")
	.attr("transform", "rotate(90)");

// add upper text label to the legend
svg.append("g")
	.selectAll(".label")  
	.data(colors)
	.enter()
	.append("text")
	.attr("class", "label")
	.attr("x", 80)
	.attr("y", 10)
	.text("17,458");

// add lower text label to the legend	
svg.append("g")	
	.append("text")
	.attr("class", "label")
	.attr("x", 80)
	.attr("y", 195)
	.text("44,338,998");

// add description to the legend	
svg.append("g")	
	.append("text")
	.attr("class", "label")
	.attr("transform", "rotate(-90)")
	.attr("font-size", "12px")
	.attr("x", -100)
	.attr("y", 95)
	.style("text-anchor", "middle")
	.text("Population per medal");	
	
svg.call(tip);	

/* 
extract the data from the json file in order to visualize it in the scatterplot
*/	
d3.json("medals.json", function(error, data) {
	// check for errors
	if (error) throw error;

	// plot x-axis along with a text label
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Population");

	// plot y-axis along with a text label	
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Medals");
	
	// plot colored dots
	svg.selectAll(".dot")
		.data(data)
    .enter().append("circle")
		.attr("class", "dot")
		.attr("r", 5)
		.attr("cx", function(d) { return x(d.Population); })
		.attr("cy", function(d) { return y(d.Medals); })
		.style("fill", function(d) { return 'rgb(255,' + Math.round(color(d.Population/d.Medals)) + ', 0)';})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
});