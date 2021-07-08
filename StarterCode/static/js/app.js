// Build the initial position of the page by setting the default Subject ID number from dropdown menu
function init (){
  var selector = d3.selectAll('#selDataset');
  d3.json('samples.json').then((data)=>{
      var sampleNames=data.names;
      sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
          });
      var defaultID = sampleNames[0];
      barChart(defaultID);
      bubbleChart(defaultID);
      metaData(defaultID);
      gaugeChart(defaultID)
    });
   };
// Refresh the data each time when a new subject ID is selected
  function optionChanged(newID) {
      barChart(newID);
      bubbleChart(newID);
      metaData(newID);
      gaugeChart(newID)
  };
  init ();
// Create a horizontal bar chart for selected Subject ID to display the top 1O OTUs found in that individual
  function barChart(subjectId){
      d3.json('samples.json').then((data)=>{
          var samples = data.samples;
          var ID = samples.map(row=>row.id).indexOf(subjectId);
          var otuValueTen = samples.map(row=>row.sample_values);
          var otuValueTen = otuValueTen[ID].slice(0,10).reverse();
          var otuIdTen = samples.map(row=>row.otu_ids);
          var otuIdTen = otuIdTen[ID].slice(0,10);
          var otuLabelTen = samples.map(row=>row.otu_labels).slice(0,10);
          var trace={
              x: otuValueTen,
              y: otuIdTen.map(r=>`UTO ${r}`),
              text: otuLabelTen,
              type:'bar',
              orientation:'h'
          }
          var layout = {title: "Top 10 Bacteria Cultures Found", margin: { t: 30, l: 150 }};
         Plotly.newPlot('bar',[trace],layout);
      })
  };
// Create a bubble chart that displays each sample for the selected subject ID
  function bubbleChart(subjectID){
      d3.json('samples.json').then((data)=>{
          var samples=data.samples;
          var ID= samples.map(row=>row.id).indexOf(subjectID);
          var otuIds = samples.map(row => row.otu_ids);
          var otuIds = otuIds[ID];            
          var sampleValues = samples.map(row => row.sample_values);
          var sampleValues = sampleValues[ID];
          var otuLabels = samples.map(row => row.otu_labels);
          var otuLabels = otuLabels[ID];
          var trace1 = {
              x: otuIds,
              y: sampleValues,
              text: otuLabels,
              mode: 'markers',
              marker: {size: sampleValues, 
                       color: otuIds
                      }
              };                       
          var layout = { xaxis: {title: 'OTU ID'},
                         height: 600,
                         width: 1000,
title: "Bacteria Cultures Per Sample"
                       };
          Plotly.newPlot('bubble',[trace1], layout);
      })
  };
// Display the metadata for each test subject ID selected;
function metaData(subjectID) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the selected ID number 
    var filteredData = metadata.filter(object => object.id == subjectID);
    var result = filteredData[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
        panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
} 
// Adapt a Gauge chart to plot weekly washing frequency of the individual
function gaugeChart(subjectID) {
  d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the selected ID number 
      var filteredData = metadata.filter(object => object.id == subjectID);
      var result = filteredData[0];
      var wfreqValue = result.wfreq;
      console.log(wfreqValue);
      var data = [
          {
            type: "indicator",
            mode: "gauge+number",
            value: wfreqValue,
            title: { text: "Belly Button Washing Frequency per Week <br> Scrubs per Week", font: { size: 18 } },
            gauge: {
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "purple" }, // Max value is 9
              bar: { color: "green" },  
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "#404040",
              // Set the colors for the different ranges on the gauge
              steps: [
                { range: [0, 1], color: "#F5F5F5" },
                { range: [1, 2], color: "#F7F7F7"},
                { range: [2, 3], color: "7aebdf"},
                { range: [3, 4], color: "#96CDCD"},
                { range: [4, 5], color: "#8DEEEE"},
                { range: [5, 6], color: "#8DD6D9"},
                { range: [6, 7], color: "#7AC5CD" },
                { range: [7, 8], color: "#5F9EA0" },
                { range: [8, 9], color: "#53868B" }
              ],  
            }  
          }  
        ];
        var layout = {
          width: 600,
          height: 450,
          margin: { t: 25, r: 25, l: 25, b: 25 },
          paper_bgcolor: "lavender",
          font: { color: "#black", family: "Arial, Helvetica, sans-serif" }
        };  
      Plotly.newPlot("gauge", data, layout);
});
}