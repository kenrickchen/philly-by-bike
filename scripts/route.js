var map = L.map('map').setView([39.95, -75.165], 12);

$.getJSON("https://opendata.arcgis.com/datasets/b5f660b9f0f44ced915995b6d49f6385_0.geojson", function(json) {
  L.geoJson(json, {style: style}).addTo(map);
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function getColor(type) {
  return type === "Sharrow" ? "#ff0000" :
         type === "Conventional" ? '#ff7b00' :
         type === "Paint Buffered"  ? '#ffc800' :
         type === "Separated Bike Lane"  ? '#00ff00' :
         type === "Two Way Separated Bike Lane"  ? '#0000ff' :
                  '#ff00ff';
}

function style(feature) {
  return {
    color: getColor(feature.properties.TYPE),
    opacity: 0.5
  };
}

var routingControl = new L.Routing.Control({
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim()
});

routingControl.addTo(map);