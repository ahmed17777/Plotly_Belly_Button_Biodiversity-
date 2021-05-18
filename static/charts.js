function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Bar, Bubble, and Gauge Charts 
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArr = data.samples;
    console.log(sampleArr);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArrFiltered = sampleArr.filter(x => x.id == sample);
    console.log(sampleArrFiltered);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = data.metadata.filter(a => a.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sample1 = sampleArrFiltered[0];
    console.log(sample1);

    // 2. Create a variable that holds the first sample in the metadata array.
    var wash = metaArray[0].wfreq;

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sample1.otu_ids;
    var otuLabels = sample1.otu_labels;
    var sampleValues = sample1.sample_values; 

    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(wash);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var top10otu = otuIds.slice(0,10).reverse();
    var yticks = top10otu.map(x => "OTU" + x);
    var top10values = sampleValues.slice(0,10).reverse; 
    console.log(top10otu, yticks, top10values);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 

    // DELIVERABLE 2 
    // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          color: otuIds,
          size: sampleValues
        }
      }];
  
    // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures per Sample",
        margin: {t:25},
        xaxis: {title: "OTU ID's"},
        hovermode: "closest",
        type: "bubble"
      };
  
    // 3. Use Plotly to plot the data with the layout.  
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // DELIVERABLE 3
    // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        domain: {x: [0,1], y: [0,1]},
        value: washFreq,
        title: {text: "Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {axis: {range: [null, 10]},
        bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "darkgreen"},
            {range: [8,10], color: "green"},
          ]}
      }];
      
    // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
       width: 700,
       height: 600,
       margin: {t:20, b:40, 1:100, r:100}
      };
  
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
