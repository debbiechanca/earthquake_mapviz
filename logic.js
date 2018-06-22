// Creating map object
var map = L.map('map', {
  center: [36.2426488,-113.7464847],
  zoom: 3,
});

// Adding tile layer
L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?' +
    'access_token=pk.eyJ1IjoiZGNoYW51YmRhIiwiYSI6ImNqaHd5MjY5MjA1eXkza28zMTJzb2w2ZnoifQ.tvHOEN8qbW2uI9K7Gdr72Q',
).addTo(map);

var link =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Function that will determine the color of the circle marker based on earthquake magnitude.
function chooseColor(d) {
    return d > 5  ? 'red' :
           d > 4  ? 'peru' :
           d > 3  ? 'orange' :
           d > 2  ? 'gold' :
           d > 1  ? 'yellow' :
                    'green';
}

function chooseSize(mag) {
    return mag > 5  ? 12 :
           mag > 4  ? 8 :
           mag > 3  ? 6 :
           mag > 2  ? 6 :
           mag > 1  ? 5 :
           mag > 0  ? 4 :
                      2;
}

function chooseFillOpacity(mag) {
    return mag > 5  ? 1 :
           mag > 4  ? .8 :
           mag > 3  ? .5 :
           mag > 2  ? .5 :
           mag > 1  ? .3 :
           mag > 0  ? .3 :
                      .1;
}; 

function setStyle(feature) {
    return { 
        color: 'white',
        stroke: true,
        fillOpacity: chooseFillOpacity(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        radius: chooseSize(feature.properties.mag),
    }
};

// When a marker is clicked, more information pops up about the earthquake.
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Location: " + feature.properties.place +
      "<br> Magnitude: " + feature.properties.mag + 
      "</h3> <hr><p>Occurrence Time: " + new Date(feature.properties.time) + "</p>");
  }

d3.json(link, function(data) {
        L.geoJSON(data, {
            pointToLayer: function (feature, coordinates) {
                return L.circleMarker(coordinates);
            }, 
            // Style each feature (in this case a neighborhood)
            style: setStyle,
            onEachFeature: onEachFeature,
        
    }).addTo(map);

});

// Create a legend to display information about the map
var legend = L.control({position: 'bottomright'});

// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + chooseColor(from + 1) + '"></i><br> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

// Add the info legend to the map
legend.addTo(map);