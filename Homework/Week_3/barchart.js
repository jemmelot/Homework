/*
	Jesse Emmelot
	11963522
	
	Visualizes data into a barchart
*/	

// define width and height
var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 2000 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// define range and spacing on the x-axis
var x = d3.scale.ordinal()
	.rangeRoundBands([-50, width], .2);

// define range of the y-axis
var y = d3.scale.linear()
	.range([height, 0]);

// variable with y-axis properties
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");	

// define the size and positioning of the chart
var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// array storing all months to be displayed
var months = 	['January', 'February', 'March', 'April',
				 'May', 'June', 'July', 'August', 'September',
				 'October', 'November', 'December']

/* 
extract the data from the json file in order to visualize it in the chart
*/
d3.json("/windspeeds.json", function(data) {
	// define the x and y domains by mapping the data from the json file
	x.domain(data.map(function(d) {return d.Date;}));
	y.domain([0, Math.max.apply(Math, data.map(function(d) {return d.Speed;}))]);
	
	// plot y-axis along with the title of the chart
	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("x", 900)
		.attr("y", 20)
		.style("font", "30px sans-serif")
		.text("Wind speeds in IJmuiden (2016)");
	
	// show the unit of data at the y-axis
	chart.append("g")
		.append("text")
		.attr("x", 15)
		.attr("y", 10)
		.style("font", "15px sans-serif")
		.text("0.1 m/s");

	// show the months under the chart
	for (var i = 0; i < months.length; i++) {
	chart.append("g")
		.append("text")
		.attr("x", (30 + (155*i)))
		.attr("y", 470)
		.style("font", "15px sans-serif")
		.text(months[i]);
	}
		
	// plot the bars along the chart
	chart.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) {return x(d.Date);})
			.attr("y", function(d) {return y(d.Speed);})
			.attr("height", function(d) {return height - y(d.Speed);})
			.attr("width", x.rangeBand())
			.append("svg:title")
			.text(function(d) {return d.Speed;});
});
/*
convert data from strings to numbers
*/
function type(d) {
	d.Speed = +d.Speed;
	return d;
}