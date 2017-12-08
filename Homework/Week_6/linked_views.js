/*
	Jesse Emmelot
	11963522
	
	This linked view contains a world map on which the color of each country
	represents either the population density or the urban percentage of
	population in that country, as well as a bar chart showing the relations
	between all country values in height.
	
	Data sources:
	- https://data.worldbank.org
	
	Code sources:
	- https://github.com/markmarkoh/datamaps/blob/master/README.md#using-custom-maps
	- https://bl.ocks.org/syncopika/f1c9036b0deb058454f825238a95b6be
*/	

// define width and height
var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 1300 - margin.left - margin.right,
	height = 320 - margin.top - margin.bottom;

// define range and spacing on the x-axis
var x = d3.scale.ordinal()
	.rangeBands([margin.left - 20, width], .2);

// define range of the y-axis
var y = d3.scale.linear()
	.range([height, 0]);

// variable with y-axis properties
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

// tooltip properties	
var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-12, 0])
	.html(function(d) {
	return  "<strong>Country:</strong> <span>" + d.country + "<br>" +
			"<strong>Value:</strong> <span>" + d.number + "</span>";
	})		

// define the size and positioning of the chart
var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
// plot y-axis along with the title of the chart
chart.append("g")
	.attr("class", "y axis")

chart.call(tip);	

// plot the world map, where lightgrey will represent no data zones
var map = new Datamap({
	element: document.getElementById('container'),
	fills: {
		defaultFill: 'lightgrey'
	}
});

/* 
when one of the selection buttons is clicked, change the data 
in both the world map and the bar chart
*/
function change(value){
	// queue both datasets
	d3.queue()
		.defer(d3.json, "urban.json")
		.defer(d3.json, "density.json")
		.await(ready);

	// when loaded, proceed
	function ready(error, urban, density) {
		if(error) return console.error(error);
		
		// toggle dataset depending on which selection button is pressed
		if(value === 'urban'){
			update(urban);
		}else if(value === 'density'){
			update(density);
		}else{
		update(urban);
		}
		
		// replace current data with other dataset
		function update(data) {
			x.domain(data.map(function(d) {return d.id;}));
			y.domain([0, Math.max.apply(Math, data.map(function(d) {return d.number;}))]);
			
			// variable for color values for countries
			var dataset = {};
			
			// define palate
			var paletteScale = d3.scale.linear()
				.domain([x.domain,y.domain])
				.range(["#EFEFFF","#02386F"]);
									
			// color each country accordingly
			data.forEach(function(d){ //
				// item example value ["USA", 70]
				var iso = d.id;
				var	value = d.number;
				dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
			
				map.updateChoropleth({iso: paletteScale(value)}, {reset: true});	
			});
						
			// show the correct axis scaling
			chart.select('.y')
				.call(yAxis)
				
			// plot the bars along the chart
			var bars = chart.selectAll(".bar")
			
			// only clear bars if there are any
			if (bars != 0) {
				bars.remove()
				bars.exit() };
			
			// plot new bars onto the chart
			bars.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) {return x(d.id);})
			.attr("y", function(d) {return y(d.number);})
			.attr("height", function(d) {return height - y(d.number);})
			.attr("width", x.rangeBand())
			
			// show tooltip containing country data when a bar is hovered
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			
			// change color of a bar when it is clicked
			.on("click", function (d) {
				d3.selectAll('.bar').style('fill','#ffdd75')
				d3.select(this).style("fill", "ff3333")
			});			
	}		
}}