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
*/	

// define width and height
var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 1300 - margin.left - margin.right,
	height = 650 - margin.top - margin.bottom;

// define range and spacing on the x-axis
var x = d3.scale.linear()
	.range([0, width]);

// define range of the y-axis
var y = d3.scale.linear()
	.range([height, 20]);

// x-axis properties	
var xAxis = d3.svg.axis()
    .scale(x)	
    .orient("bottom")	
	
// y-axis properties
var yAxis = d3.svg.axis()
	.scale(y)
	.tickFormat(d3.format("s"))
	.orient("left");

// tooltip properties	
var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-12, 0])
	.html(function(d) {
	return  "<strong>Country:</strong> <span>" + d.country + "<br>" +
			"<strong>Urbanization(%):</strong> <span>" + d.urban + "<br>" +
			"<strong>GDP(US$):</strong> <span>" + d.gdp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); + "</span>";
	})		

// define the size and positioning of the chart
var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add text for within button
var urbanText = chart.append("text")
	.attr("x", 0)
	.attr("y", 0)
	.text("Urbanization");

// add rectangle to signify a button	
var urbanRect = chart.append("rect")
	.attr("x", -5)
	.attr("y", -13)
	.style("fill", "steelblue")
	.style("opacity", "0.5")
	.style("stroke", "black")
	.attr("width", 77)
	.attr("height", 18);
	
var title = chart.append("text")
	.attr("x", width/2)
	.attr("y", 0)
	.attr("text-anchor", "middle")
	.style("font", "25px sans-serif")
	.text("Global relation between urbanization and GDP");
	
var xText = chart.append("text")
	.attr("x", width - 90)
	.attr("y", height + 30)	
	.text("Urbanization");
	
var yText = chart.append("text")
	.attr("transform", "rotate(-90)")
	.attr("x", -80)
	.attr("y", -20)
	.text("GDP");	
	
var jesse = chart.append("text")
	.attr("x", width - 120)
	.attr("y", 0)
	.text("Jesse Emmelot, 11963522");	

// add text for within button
var gdpText = chart.append("text")
	.attr("x", 85)
	.attr("y", 0)
	.text("GDP");

// add rectangle to signify a button	
var gdpRect = chart.append("rect")
	.attr("x", 80)
	.attr("y", -13)
	.style("fill", "steelblue")
	.style("opacity", "0.5")
	.style("stroke", "black")
	.attr("width", 35)
	.attr("height", 18);	
	
// plot y-axis along with the title of the chart
chart.append("g")
	.attr("class", "y axis")

chart.call(tip);	

// queue both datasets
d3.queue()
	.defer(d3.json, "urban.json")
	.defer(d3.json, "gdp.json")	
	.await(ready);

// when loaded, proceed	
function ready(error, urban, gdp) {
	if(error) return console.error(error);
	
	// define array for scatterplot data
	var both = [];
	
	// define object for map country data
	var names = {};
		
	for (var i = 0; i < urban.length; i++) {
		// combine the data from the two files to serve as scatterplot data
		both.push(urban[i]);
		both[i]["gdp"] = gdp[i].gdp;
		
		var name = urban[i].id;
		var urbanData = urban[i].urban;
		var gdpData = gdp[i].gdp;
		gdpData = gdpData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		names[name] = {urbanValue: urbanData, gdpValue: gdpData};
	}
			
	// plot the world map, where lightgrey will represent no data zones
	var map = new Datamap({
		element: document.getElementById('container'),
		projection: 'mercator',
		fills: {
			defaultFill: 'lightgrey'
		},
		data: names,
		geographyConfig: {
			// show country information in the tooltip
			popupTemplate: function(geo, data) {
				// don't show tooltip if a country is not in the dataset
				if (!data) { return ; }
				// tooltip content
				return ['<div class="hoverinfo">',
					'<strong>', geo.properties.name, '</strong>',
					'<br>Urbanization(%): <strong>', data.urbanValue, '</strong>',
					'<br>GDP(US$): <strong>', data.gdpValue, '</strong>',
					'</div>'].join('');
			}
		},
		done: function(datamap) {
			datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
				/*
				when a country on the map is clicked, highlight it and scroll down to the scatterplot,
				highlighting the dot for that country
				*/
				var countryId = geography.id;
				window.scrollTo(0, 1300);
				d3.selectAll('.dot')
					.style('fill','#ffdd75')
					.attr("r", 5);
				d3.select('#name' + countryId)
					.style("fill", "#ff3333")
					.attr("r", 10);	
				map.updateChoropleth(null, {reset: true})
				for (key in map.options.data) {
					var data = {}
					if (key == countryId) {
						data[key] = "#02386F"
						map.updateChoropleth(data)
					}
				}				
			});
		}
	});
		
	// replace current data with other dataset
	function scatterplot(data, set) {
		// reset all dot colors
		d3.selectAll('.dot')
			.style('fill','gold')
			
		// define data domain
		if (set == 0) {
			var minValue = 0,
				maxValue = 100;
		}
		
		// define data domain
		if (set == 1) {
			var minValue = Math.min.apply(Math, data.map(function(d) {return d.gdp;}));
				maxValue = Math.max.apply(Math, data.map(function(d) {return d.gdp;}));
		}
		
		// variable for color values for countries
		var dataset = {};
		
		// define palate
		var paletteScale = d3.scale.linear()
			.domain([minValue, maxValue])
			.range(["#EFEFFF","#02386F"]);
				
		// assign color code to each country
		data.forEach(function(d){
			var iso = d.id;
			if (set == 0) {
				var value = d.urban;
			}
			if (set == 1) {
				var value = d.gdp;
			}
							
			dataset[iso] = {numberOfThings: value, fillColor: paletteScale(value)};			
		});

		// update the color for every single country depending on the dataset
		map.updateChoropleth(dataset);
	}

	// when clicked, reset the scatterplot and color map accordingly
	urbanRect.on("click", function() {
		d3.selectAll('.dot')
			.style('fill','#ffdd75')
			.attr("r", 5);
		window.scrollTo(0, 0);
		scatterplot(both, 0);
	});
	
	// when clicked, reset the scatterplot and color map accordingly
	gdpRect.on("click", function() {
		d3.selectAll('.dot')
			.style('fill','#ffdd75')
			.attr("r", 5);
		window.scrollTo(0, 0);	
		scatterplot(both, 1);
	});
	
	// domains for the scatterplot
	x.domain([0, Math.max.apply(Math, both.map(function(d) {return d.urban;}))]);
	y.domain([0, Math.max.apply(Math, both.map(function(d) {return d.gdp;}))]);
		
	// plot x-axis
	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
			
	// plot y-axis	
	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis);
	
	// plot colored dots
	chart.selectAll(".dot")
		.data(both)
		.enter().append("circle")
			.attr("class", "dot")
			.attr('id', function(d){ return 'name' + d.id; })
			.attr("r", 5)
			.attr("cx",  function(d) {return x(d.urban);})
			.attr("cy", function(d) {return y(d.gdp);})
			.style("fill", 'gold')
			.style("stroke", "black")
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)		
			/*
			when a dot is clicked, change color and size of it. Scroll up to the map
			and highlight the selected country in blue.
			*/
			.on("click", function (d) {
				window.scrollTo(0, 0);
				d3.selectAll('.dot')
					.style('fill','#ffdd75')
					.attr("r", 5);
				d3.select(this)
					.style("fill", "#ff3333")
					.attr("r", 10);
				map.updateChoropleth(null, {reset: true})
				for (key in map.options.data) {
					var data = {}
					if (key == d.id) {
						data[key] = "#02386F"
						map.updateChoropleth(data)
					}
				}						
			});	
}