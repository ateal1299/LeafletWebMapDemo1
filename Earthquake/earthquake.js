var map = L.map('earthquakemap').setView([38,-95], 4);
var basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var basemap = L.tileLayer(basemapUrl, {attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
//add earthquake data
var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

$.getJSON(earthquakeUrl, function(data) {

    L.geoJSON(data, {

        pointToLayer: function(feature, latlng) {

            var magnitude = feature.properties.mag;

            var markerColor = 'green';

            if (magnitude >= 2) markerColor = 'yellow';
            if (magnitude >= 3) markerColor = 'orange';
            if (magnitude >= 4) markerColor = 'red';
            if (magnitude >=5) markerColor = 'purple';

            return L.circleMarker(latlng, {
                radius: Math.max(4, magnitude * 3),
                color: markerColor,
                weight: 2,
                fillColor: markerColor,
                fillOpacity: 0.8
            });

        },

        onEachFeature: function(feature, layer) {

            var magnitude = feature.properties.mag;
            var location = feature.properties.place;
            var time = new Date(feature.properties.time).toLocaleString();

            layer.bindPopup(
                '<b>Magnitude:</b> ' + magnitude +
                '<br><b>Location:</b> ' + location +
                '<br><b>Time:</b> ' + time  
            );
        }

    }).addTo(map);

    //add magnitude legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'legend');

        div.innerHTML =
            '<b>Earthquake Magnitude</b><br>' +
            '<i style="background: green"></i> Less than 2<br>' +
            '<i style="background: yellow"></i> 2 - 2.9<br>' +
            '<i style="background: orange"></i> 3 - 3.9<br>' +
            '<i style="background: red"></i> 4 - 4.9<br>' +
            '<i style="background: purple"></i> 5 or greater';

        return div;

    };

    legend.addTo(map);

});
