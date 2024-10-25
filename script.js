// URL of the dataset (Global temperature data)
var datasetUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Get colors from ColorBrewer
// http://colorbrewer2.org/
var colorbrewer = {
  RdYlBu: {
    3: ["#fc8d59", "#ffffbf", "#91bfdb"],
    4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
    6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
    7: [
      "#d73027",
      "#fc8d59",
      "#fee090",
      "#ffffbf",
      "#e0f3f8",
      "#91bfdb",
      "#4575b4",
    ],
    8: [
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4",
    ],
    9: [
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#ffffbf",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4",
    ],
    10: [
      "#a50026",
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4",
      "#313695",
    ],
    11: [
      "#a50026",
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#ffffbf",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4",
      "#313695",
    ],
  },
  RdBu: {
    3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
    4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
    5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
    6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
    7: [
      "#b2182b",
      "#ef8a62",
      "#fddbc7",
      "#f7f7f7",
      "#d1e5f0",
      "#67a9cf",
      "#2166ac",
    ],
    8: [
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac",
    ],
    9: [
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#f7f7f7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac",
    ],
    10: [
      "#67001f",
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac",
      "#053061",
    ],
    11: [
      "#67001f",
      "#b2182b",
      "#d6604d",
      "#f4a582",
      "#fddbc7",
      "#f7f7f7",
      "#d1e5f0",
      "#92c5de",
      "#4393c3",
      "#2166ac",
      "#053061",
    ],
  },
};

// Select the SVG element and define margins and dimensions
var svg = d3.select("svg"),
  margin = { top: 100, right: 100, bottom: 100, left: 100 },
  width = svg.attr("width") - margin.left - margin.right,
  height = svg.attr("height") - margin.top - margin.bottom;

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Fetch the dataset using d3.json()
d3.json(datasetUrl).then(function (data) {
  var temperatureData = data;

  // Define the x and y scales based on the data (years as continuous)
  var xScale = d3
    .scaleBand()
    .domain(data.monthlyVariance.map((d) => d.year))
    .range([0, width]);

  var yScale = d3
    .scaleBand()
    .domain(d3.range(1, 13)) // 0 to 11 for months
    .range([0, height]);

  // Adjust fontsize
  var fontSize = 16;

  // Add padding
  var padding = {
    left: 9 * fontSize,
    right: 9 * fontSize,
    top: 1 * fontSize,
    bottom: 8 * fontSize,
  };

  // Add the x-axis
  g.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
    .append("text")
    .text("Years")
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + width / 2 + "," + 3 * fontSize + ")")
    .attr("fill", "black");

  // Add the y-axis
  g.append("g")
    .attr("id", "y-axis")
    .call(
      d3.axisLeft(yScale).tickFormat((d) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return months[d - 1];
      })
    )
    .append("text")
    .text("Months")
    .style("text-anchor", "middle")
    .attr(
      "transform",
      "translate(" + -7 * fontSize + "," + height / 2 + ")" + "rotate(-90)"
    )
    .attr("fill", "black");

  // Create a Tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip") // Set the ID to tooltip
    .style("opacity", 0)
    .style("position", "absolute") // Position it absolutely
    .style("background-color", "white")
    .style("border", "solid 1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("pointer-events", "none"); // Prevent the tooltip from capturing mouse events

  // Mouseover, mousemove, and mouseleave event handlers for tooltip
  var mouseover = function (event, d) {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    tooltip
      .html(
        `${d.year} - ${months[d.month]} <br> Temperature: ${
          data.baseTemperature + d.variance
        }℃ <br> Variance: ${d.variance}℃`
      )
      .style("opacity", 1)
      .attr("data-year", d.year);
  };

  var mousemove = function (event) {
    tooltip
      .style("left", event.clientX + 10 + "px") // Using clientX instead of pageX
      .style("top", event.clientY - 28 + "px"); // Using clientY instead of pageY
  };

  var mouseleave = function () {
    tooltip.style("opacity", 0); // Hide the tooltip when the mouse leaves
  };

  // Create a legend
  var legendColors = colorbrewer.RdYlBu[11].reverse();
  var legendWidth = 400;
  var legendHeight = 300 / legendColors.length;

  var variance = temperatureData.monthlyVariance.map(function (val) {
    return val.variance;
  });

  var minTemp =
    temperatureData.baseTemperature + Math.min.apply(null, variance);
  var maxTemp =
    temperatureData.baseTemperature + Math.max.apply(null, variance);

  var legendThreshold = d3
    .scaleThreshold()
    .domain(
      (function (min, max, count) {
        var array = [];
        var step = (max - min) / count;
        var base = min;
        for (var i = 1; i < count; i++) {
          array.push(base + i * step);
        }
        return array;
      })(minTemp, maxTemp, legendColors.length)
    )
    .range(legendColors);

  var legendX = d3
    .scaleLinear()
    .domain([minTemp, maxTemp])
    .range([0, legendWidth]);

  var legendXAxis = d3
    .axisBottom()
    .scale(legendX)
    .tickSize(10, 0)
    .tickValues(legendThreshold.domain())
    .tickFormat(d3.format(".1f"));

  var legend = svg
    .append("g")
    .classed("legend", true)
    .attr("id", "legend")
    .attr(
      "transform",
      "translate(" +
        padding.left +
        "," +
        (padding.top + height + padding.bottom - 2 * legendHeight) +
        ")"
    );

  legend
    .append("g")
    .selectAll("rect")
    .data(
      legendThreshold.range().map(function (color) {
        var d = legendThreshold.invertExtent(color);
        if (d[0] === null) {
          d[0] = legendX.domain()[0];
        }
        if (d[1] === null) {
          d[1] = legendX.domain()[1];
        }
        return d;
      })
    )
    .enter()
    .append("rect")
    .style("fill", function (d) {
      return legendThreshold(d[0]);
    })
    .attr("x", (d) => legendX(d[0])) // Position based on the legendX scale
    .attr("y", 0) // Fixed y position
    .attr("width", (d) =>
      d[0] && d[1] ? legendX(d[1]) - legendX(d[0]) : legendX(null)
    ) // Calculate width of each legend block
    .attr("height", legendHeight); // Set the height of the rect

  legend
    .append("g")
    .attr("transform", "translate(0," + legendHeight + ")")
    .call(legendXAxis);

  // Add cells to the heat map
  g.selectAll(".cell")
    .data(temperatureData.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => temperatureData.baseTemperature + d.variance)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) =>
      legendThreshold(temperatureData.baseTemperature + d.variance)
    )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
});
