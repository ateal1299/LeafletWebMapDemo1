var map = L.map('combinedmap').setView([38, -95], 4);

var basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

var basemap = L.tileLayer(basemapUrl, {
    attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//create earthquake layer
var earthquakeLayer = L.layerGroup().addTo(map);

var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

$.getJSON(earthquakeUrl, function(data) {

    L.geoJSON(data, {

        pointToLayer: function(feature, latlng) {
            var magnitude = feature.properties.mag;
            var markerColor = 'green';

            if (magnitude >= 2) markerColor = 'yellow';
            if (magnitude >= 3) markerColor = 'orange';
            if (magnitude >= 4) markerColor = 'red';
            if (magnitude >= 5) markerColor = 'purple';

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
    }).addTo(earthquakeLayer);

});

//create weather alert layer
var weatherAlertLayer = L.layerGroup().addTo(map);

//load NWS weather alerts
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';

$.getJSON(weatherAlertsUrl, function(data) {

    L.geoJSON(data, {

        style: function(feature) {

            var alertColor = 'orange';

            if (feature.properties.severity === 'Severe') alertColor = 'red';
            if (feature.properties.severity === 'Extreme') alertColor = 'purple';

            return {
                color: alertColor,
                weight: 2,
                fillOpacity: 0.2
            };
        },

        onEachFeature: function(feature, layer) {

            layer.bindPopup(
                '<b>Weather Alert:</b><br>' +
                feature.properties.headline
            );
        }

    }).addTo(weatherAlertLayer);

});

//add layer control
var overlayMaps = {
    "Earthquakes": earthquakeLayer,
    "Weather Alerts": weatherAlertLayer
};

L.control.layers(null, overlayMaps).addTo(map);