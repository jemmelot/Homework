/*
	Jesse Emmelot
	11963522
	
	Edit svg file to display in html
*/	

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;    
    document.body.appendChild(xml.documentElement);   
	
	var colors =  ["#41ae76","#238b45","#005824", "grey"]
	
	var color = 0
	var amount = 100
	
	// add missing rectangles
	for (var i = 140; i <= 260; i+=40) {
		d3.select("svg").append("rect")
			.attr("class", "st1")
			.attr("x", 13)
			.attr("y", i)
			.attr("width", 21)
			.attr("height", 29)
			.style("fill", colors[color]);
		
		if (i != 140) {	
		d3.select("svg").append("rect")
			.attr("class", "st2")
			.attr("x", 46.5)
			.attr("y", i)
			.attr("width", 119.1)
			.attr("height", 29)
		}	
		
		color++;
	}

	// add remaining colors
	d3.select("svg").append("rect")
			.attr("class", "st1")
			.attr("x", 13)
			.attr("y", 13.5)
			.attr("width", 21)
			.attr("height", 29)
			.style("fill", "#ccece6");
			
	d3.select("svg").append("rect")
			.attr("class", "st1")
			.attr("x", 13)
			.attr("y", 56.9)
			.attr("width", 21)
			.attr("height", 29)
			.style("fill", "#99d8c9");
			
	d3.select("svg").append("rect")
			.attr("class", "st1")
			.attr("x", 13)
			.attr("y", 96.8)
			.attr("width", 21)
			.attr("height", 29)
			.style("fill", "#66c2a4");
	
	// add text
	for (var i = 40; i <= 280; i+=40) {
		if (i == 280) {
			d3.select("svg").append("text")
				.attr("x", 50)
				.attr("y", i)
				.text("Unknown Data")
		}
		
		else {
			d3.select("svg").append("text")
				.attr("x", 50)
				.attr("y", i)
				.text(amount)
		}	
		
		amount *=10		
	}	
});