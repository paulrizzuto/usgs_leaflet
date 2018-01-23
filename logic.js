var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryURL, function(data){
   var earthquakeData = data.features

   var quakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return new L.circle(latlng, 
            {radius: radize(feature.properties.mag),
            fillColor: colorize(feature.properties.mag),
            fillOpacity: .5,
            stroke: true,
            color: "black",
            weight: .5

        })
        },
    onEachFeature: function (feature, layer){
        layer.bindPopup("<h4>" + feature.properties.place + "</h4>" + "<hr> Magnitude: " + feature.properties.mag + "<br> Time: " + feature.properties.time)
    }
  })
      createMap(quakes)
});

var MoonlightMap = L.tileLayer("https://api.mapbox.com/styles/v1/paulrizzuto/cjcs1mqom1m6o2spckq7czh6k/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF1bHJpenp1dG8iLCJhIjoiY2phazl6MGwyMmhzdDJ3bGQwdnV4OW52ciJ9.QE1jMWpHAsipHX3-KEw1Fw");
var DarkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ");

function createMap(quakeViz){
   var baseMaps = {
    "Dark Map": DarkMap,
    "Moonlight Map": MoonlightMap,
  };

var overlayMap = {
    "Earthquakes": quakeViz,
  };

var mymap = L.map('map-section', {
    center: [36, -115],
    zoom: 3,
    layers: [MoonlightMap, quakeViz],
    maxBounds: L.latLngBounds([90, -180], [-90, 180])
}); 

var mapLegend = L.control({position: 'bottomright'});
mapLegend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'legend'),
        magnitudes = [0, 1, 2, 3, 4, 5],
        labels = [];
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorize(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : '+');
    }
    return div;
};
mapLegend.addTo(mymap);

L.control.layers(baseMaps, overlayMap, {
    collapsed: false
  }).addTo(mymap);
}

function colorize(c) {
  return c > 5 ? '#FF1617': c > 4 ? '#FF8417': c > 3 ? '#FFB517': c > 2 ? '#FFD317': c > 1 ? '#FFFF87': '#00FF87';
}

function radize(value){
  return value*40000
}