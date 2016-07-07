/*
*	Define chart 
*/
function punchcard(){
	// Default settings
	var $el = d3.select("body");
	var maxRadius = 9;
	var minRadius = 2;
	var margin = {top: 0, right: 100, bottom: 40, left: 100};
	var width = 800;
	var height = 700;
	var color = "green";
	var data = [];
	var object = {};
	var formatTick = d3.format("0000");
	var svg, x, xAxis, allValues, xScale, colorScale;
	var rowHeight = (maxRadius*4)+2;
	var useGlobalScale = true;

	object.render = function(){
				x = d3.scale.linear()
					.range([0, width]);

				xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom");

				xAxis.ticks(data[0].values.length)
						.tickFormat(formatTick);

				svg = $el.append("svg")
					.attr("width", width + margin.left + margin.right )
					.attr("height", height + margin.bottom)
					.style("margin-left", margin.left + "px")
					.append("g")
					.attr("fill","yellow")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var domain = d3.extent(allValues, function(d){return d['key'];});
				var valDomain = d3.extent(allValues, function(d){return d['value'];});
				x.domain(domain);

				xScale = d3.scale.linear()
					.domain(domain)
					.range([0, width]);

				colorScale = d3.scale.linear()
		      			.domain(d3.extent(allValues, function(d){return d['value'];}))
		      			.range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height - margin.bottom) + ")")
					.call(xAxis);

				function mouseover(p) {
					var g = d3.select(this).node().parentNode;
					d3.select(g).selectAll("rect").style("display","none");
					d3.select(g).selectAll("text.value").style("display","block");
				}

				function mouseout(p) {
					var g = d3.select(this).node().parentNode;
					d3.select(g).selectAll("rect").style("display","block");
					d3.select(g).selectAll("text.value").style("display","none");
				}

				for (var j = 0; j < data.length; j++) {
					var g = svg.append("g");

					var circles = g.selectAll("rect")
						.data(data[j]['values'])
						.enter()
						.append("rect");

					var text = g.selectAll("text")
						.data(data[j]['values'])
						.enter()
						.append("text");

					var rDomain = useGlobalScale? valDomain : [0, d3.max(data[j]['values'], function(d) { return d['value']; })];
					var rScale = d3.scale.linear()
						.domain(rDomain)
						.range([minRadius, maxRadius]);

					circles
						.attr("x", function(d, i) { return xScale(d['key']); })
						.attr("y", (height - margin.bottom - rowHeight*2) - (j*rowHeight)+rowHeight)
						.attr("width", function(d) { return 3*rScale(d['value']); })
						.attr("height", function(d) { return 3*rScale(d['value']); })
						.style("fill", function(d) { return colorScale(d['value']) });

					text
						.attr("y",(height - margin.bottom - rowHeight*2) - (j*rowHeight)+(rowHeight+5))
						.attr("x",function(d, i) { return xScale(d['key'])-5; })
						.attr("class","value")
						.text(function(d){ return d['value']; })
						.style("fill", function(d) { return colorScale(d['value']) })
						.style("display","none");

					g.append("text")
						.attr("y", (height - margin.bottom - rowHeight*2) - (j*rowHeight)+(rowHeight+5))
						.attr("x",width+rowHeight)
						.attr("class","label")
						.text(data[j]['key'])
						.style("fill", function(d) { return color })
						.on("mouseover", mouseover)
						.on("mouseout", mouseout);
				};

				return object;
	};

	//Getter and setter methods
  object.data = function(value){
    if (!arguments.length) return data;
    data = value;
    allValues = [];
		data.forEach(function(d){
			allValues = allValues.concat(d.values);
		});
    return object;
  };

  object.minRadius = function(value){
  	if (!arguments.length) return minRadius;
  	minRadius = value;
  	return object;
  };

  object.maxRadius = function(value){
  	if (!arguments.length) return maxRadius;
  	maxRadius = value;
  	rowHeight = (maxRadius*2)+2;
  	return object;
  };

  object.$el = function(value){
    if (!arguments.length) return $el;
    $el = value;
    return object;
  };

  object.width = function(value){
    if (!arguments.length) return width;
    width = value;
    return object;
  };

  object.height = function(value){
    if (!arguments.length) return height;
    height = value;
    return object;
  };

  object.color = function(value){
    if (!arguments.length) return color;
    color = value;
    return object;
  };

 	object.useGlobalScale = function(value){
    if (!arguments.length) return useGlobalScale;
    useGlobalScale = value;
    return object;
  };
  return object;
};