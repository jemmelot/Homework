/*
	Jesse Emmelot
	11963522
	
	Shows the average, shortest and longest stage length for every
	year of Tour de France and Giro d'Italia. Only regular full stages
	are	considered (no time trials or split stages).
	
	Notes:
	- During World War I & II neither of the Grand Tours were organized,
	  hence the line gaps.
	- During the first few decades of both Grand Tours the number of stages
	  gradually increased, decreasing the stage lengths.
				
	Data sources:
	- https://en.wikipedia.org/wiki/Tour_de_France
	- https://en.wikipedia.org/wiki/Giro_d%27Italia
	- http://www.bikeraceinfo.com/
	
	Code sources:
	- https://bl.ocks.org/mbostock/3884955
	- https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
	- http://bl.ocks.org/d3noob/5d621a60e2d1d02086bf
	- https://www.w3schools.com/howto/howto_css_dropdown.asp
*/	

// define spacial properties
var	margin = {top: 60, right: 20, bottom: 30, left: 50},
	width = 1300 - margin.left - margin.right,
	height = 620 - margin.top - margin.bottom;
 
// define range of the x-axis
var	x = d3.scale.linear()
	.range([0, width]);

// define range of the y-axis
var	y = d3.scale.linear()
	.range([height, 0]);

// text labels for the legend	
var labels = [	"Tour maximum", "Tour average", "Tour minimum", 
				"Giro maximum", "Giro average", "Giro minimum"];

// colors for the legend
var colors = ["blue", "steelblue" , "lightblue", "red", "orangered", "orange"];				

// define color selection of the lines	
var color = d3.scale.ordinal()
	.domain([	"TourMaximum", "TourAverage", "TourMinimum", 
			"GiroMaximum", "GiroAverage", "GiroMinimum"])
	.range(["orangered", "orange", "red", "steelblue", "blue", "lightblue"]);
 
// x-axis properties
var	xAxis = d3.svg.axis()
	.scale(x)
	.tickFormat(d3.format("d"))
	.orient("bottom");
	
// y-axis properties
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");	
 
// define the line
var	line = d3.svg.line()
	.defined(function (d) { return d.Length != 0;})
	.interpolate("basis")
	.x(function(d) { return x(d.Year);})
	.y(function(d) { return y(d.Length);});
    
// add the svg canvas
var	svg = d3.select("body")
	.append("svg")
		.attr("width", width + margin.left + margin.right + 57)
		.attr("height", height + margin.top + margin.bottom + 35)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add graph title		
svg.append("g")	
	.append("text")
	.attr("class", "label")
	.attr("font-size", "25px")
	.attr("x", width / 2)
	.attr("y", margin.top - 80)
	.attr("text-anchor", "middle")
	.text("Stage lengths throughout Grand Tour history");

// add student name
svg.append("g")	
	.append("text")
	.attr("class", "label")
	.attr("font-size", "12px")
	.attr("x", width + 60)
	.attr("y", height + 60)
	.attr("text-anchor", "end")
	.text("Jesse Emmelot, 11963522");	
 
// load in the data file
d3.json("tours.json", function(error, data) {	
	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
	
	// map colors to the lines
	var tours = color.domain().map(function(name) {
		return {
			name: name,
			values: data.map(function(d) {
				return {Year: d.Year, Length: +d[name]};
			})
		};
	});
	
	// define the axis domains
	x.domain(d3.extent(data, function(d) { return d.Year; }));
	y.domain([
		d3.min(tours, function(c) { return d3.min(c.values, function(v) { return v.Length; }); }),
		d3.max(tours, function(c) { return d3.max(c.values, function(v) { return v.Length; }); })
	]);

	for (var i = 0; i < 120; i += 20) {
		// add colored rectangles to the legend matching line colors
		svg.append("rect")
			.attr("x", width - 100)
			.attr("y", i)
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", colors[i/20]);
			
		// add text next to the legend rectangles 	
		svg.append("text")
			.attr("x", width - 85)
			.attr("y", i + 9)
			.text(labels[i/20]);	
	};

	// add the x-axis
	svg.append("g")		
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("x", width)
		.attr("y", 15)
		.attr("dy", ".71em")
		.style("text-anchor", "middle")
		.text("Year");
 
	// add the y-axis
	svg.append("g")		
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", -28)
		.attr("y", -15)
		.attr("dy", ".71em")
		.text("Km");
			
	// define variable that uses data to plot the lines
	var tour = svg.selectAll(".tour")
		.data(tours)
		.enter().append("g")
		.attr("class", "tour");
 
	// add the colored lines
	tour.append("path")	
		.attr("class", "line")
		.attr("id", function(d) { return d.name; })
		.attr("d", function(d) { return line(d.values); })
		.style("fill", "none")
		.style("stroke", function(d) { return color(d.name); });	
 
	// define variable for mouse movement effects
	var mouseG = svg.append("g")
		.attr("class", "mouse-over-effects");
	
	// add vertical line along the moving circles
	mouseG.append("path")
		.attr("class", "mouse-line")
		.style("stroke", "black")
		.style("stroke-width", "1px")
		.style("opacity", "0");
	
	// variable to make the moving dot functional along the colored lines
	var lines = document.getElementsByClassName("line");

	// variable required to display the data on every line simultaneously
	var mousePerLine = mouseG.selectAll(".mouse-per-line")
		.data(tours)
		.enter()
		.append("g")
		.attr("class", "mouse-per-line");
	
	// add circles at every line at the mouse cursor
	mousePerLine.append("circle")
		.attr("r", 5)
		.style("stroke", function(d) {
			return color(d.name);
		})
		.style("fill", "none")
		.style("stroke-width", "1px")
		.style("opacity", "0");

	// define position attribute for the text next to the circles	
    mousePerLine.append("text")
		.attr("transform", "translate(10,3)");
 	
	/*
	add a non visible rectangle, with the same dimensions as the axes, in order
	to track mouse movement along the graph. When the mouse cursos is inside
	this rectangle, display the circles, text and vertical line along the colored 
	lines. When outside the bounds, hide them. 
	*/
	mouseG.append("svg:rect")
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "none")
		.attr("pointer-events", "all")
		.on("mouseout", function() {
			d3.select(".mouse-line")
			  .style("opacity", "0");
			d3.selectAll(".mouse-per-line circle")
			  .style("opacity", "0");
			d3.selectAll(".mouse-per-line text")
			  .style("opacity", "0");
		})
		.on("mouseover", function() {
			d3.select(".mouse-line")
			  .style("opacity", "1");
			d3.selectAll(".mouse-per-line circle")
			  .style("opacity", "1");
			d3.selectAll(".mouse-per-line text")
			  .style("opacity", "1");
		})	
		.on("mousemove", function() {
			var mouse = d3.mouse(this);
			d3.select(".mouse-line")
				.attr("d", function() {
					var d = "M" + mouse[0] + "," + height;
					d += " " + mouse[0] + "," + 0;
					return d;
				});

			d3.selectAll(".mouse-per-line")
				.attr("transform", function(d, i) {					
					var xYear = x.invert(mouse[0]),
						bisect = d3.bisector(function(d) { return d.Year; }).right;
						idx = bisect(d.values, xYear);
						
					var beginning = 0,
						end = lines[i].getTotalLength(),
						target = null;

					while (true){
						target = Math.floor((beginning + end) / 2);
						pos = lines[i].getPointAtLength(target);
						if ((target === end || target === beginning) && pos.x !== mouse[0]) {
							break;
						}
						if (pos.x > mouse[0])      end = target;
						else if (pos.x < mouse[0]) beginning = target;
						else break;
					}

					// display custom text in the first line gap
					if (x.invert(pos.x).toFixed(1) > 1913.9 && x.invert(pos.x).toFixed(0) < 1919) {
						d3.select(this).select('text')						
						.text("WW1");
					}
					
					// display custom text in the second line gap
					else if (x.invert(pos.x).toFixed(1) > 1938.9 && x.invert(pos.x).toFixed(0) < 1947) {
						d3.select(this).select('text')						
						.text("WW2");
					}
					
					// display stage length and year next to the circles on the colored lines
					else {
						d3.select(this).select('text')						
						.text(y.invert(pos.y).toFixed(0) + " km, " + x.invert(pos.x).toFixed(0));
					}
										
					return "translate(" + mouse[0] + "," + pos.y +")";
				});
		});
	
	// toggle for the Tour lines
	svg.append("text")
		.attr("x", 20)             
		.attr("y", height - 90)    
		.attr("class", "legend")
		.attr("font-size", "15px")
		.style("fill", "steelblue")         
		.on("click", function(d){
		
		// determine if current line is visible
		var active   = (TourAverage.active || TourMaximum.active || TourMinimum.active) ? false : true,
			  newOpacity = active ? 0 : 1;
			
			// hide or show the elements
			d3.select("#TourAverage").style("opacity", newOpacity);
			d3.select("#TourMaximum").style("opacity", newOpacity);
			d3.select("#TourMinimum").style("opacity", newOpacity);
			// update whether or not the elements are active
			TourAverage.active = active;
		})
		.text("Tour de France");
		
	// toggle for the Giro lines
	svg.append("text")
		.attr("x", 20)             
		.attr("y", height - 65)    
		.attr("class", "legend")
		.attr("font-size", "15px")
		.style("fill", "orangered")         
		.on("click", function(d){
		
		// determine if current line is visible
		var active   = (GiroAverage.active || GiroMaximum.active || GiroMinimum.active) ? false : true,
			  newOpacity = active ? 0 : 1;
			
			// hide or show the elements
			d3.select("#GiroAverage").style("opacity", newOpacity);
			d3.select("#GiroMaximum").style("opacity", newOpacity);
			d3.select("#GiroMinimum").style("opacity", newOpacity);
			// update whether or not the elements are active
			GiroAverage.active = active;
		})
		.text("Giro d'Italia");	
});