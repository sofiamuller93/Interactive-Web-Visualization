function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data) {
    console.log("newdata", data);
    // Use d3 to select the panel with id of `#sample-metadata`
    var SampleMetaData = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
    SampleMetaData.html("");

    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function([key,value]) {
      SampleMetaData.append('span').text(`${key}: ${value}`);
      SampleMetaData.append('br')
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    console.log("sample", data);
  // @TODO: Build a Bubble Chart using the sample data
    var BubbleChartTraceData = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values
      }
    }];

    var BubbleChartLayout = {
      hovermode: 'closest',
      title: 'OTU Bubble Chart',
      xaxis: {zeroline:false, title:'OTU ID'},
      yaxis: {zeroline:false, title:'Values'}
    };

    Plotly.newPlot('bubble',BubbleChartTraceData,BubbleChartLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_values = data.sample_values.slice(0,10);
    var pie_labels = data.otu_ids.slice(0,10);
    var pie_hover = data.otu_labels.slice(0,10);

    var PieChartData = [{
      values: pie_values,
      labels: pie_labels,
      hoverinfo: pie_hover,
      type: 'pie'
    }];

    Plotly.newPlot('pie', PieChartData);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
