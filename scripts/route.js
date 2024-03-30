const map = L.map('map').setView([39.95, -75.165], 13);

$.getJSON("resources/bike_network.geojson", function(json) {
  L.geoJson(json, {style: style}).addTo(map);
});

let pathfinder;
let points;
$.getJSON("resources/network.geojson", function(json) {
  pathfinder = new geojsonPathFinder(json);
  points = turf.explode(json);
});

let start;
let end;

const geocoder = L.Control.geocoder({
  geocoder: L.Control.Geocoder.photon()
});

geocoder.addTo(map);
geocoder.on('markgeocode', function(result) {
  let point = turf.point([result.geocode.center.lng, result.geocode.center.lat]);
  if (start === undefined) {
    start = point;
  } else {
    end = point;
    let startInNetwork = turf.nearest(start, points);
    let endInNetwork = turf.nearest(end, points);
    let path = pathfinder.findPath(startInNetwork, endInNetwork).path;
    path.forEach(function(array) {
      array.reverse();
    })
    let polyline = L.polyline(path, {color: 'white'}).addTo(map);
    map.fitBounds(polyline.getBounds());
  }
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