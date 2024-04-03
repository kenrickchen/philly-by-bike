let map = L.map('map').setView([39.95, -75.165], 13);

let control = L.Routing.control({
  geocoder: L.Control.Geocoder.photon(),
  reverseWaypoints: true,
  router: L.Routing.mapzen('', {
    costing:'bicycle'
  }),
  formatter: new L.Routing.mapzenFormatter(),
}).addTo(map);

function createButton(label, container) {
  var btn = L.DomUtil.create('button', '', container);
  btn.setAttribute('type', 'button');
  btn.innerHTML = label;
  return btn;
}

map.on('click', function(e) {

  let container = L.DomUtil.create('div');
  let startButton = createButton('Start from this location', container);
  let destinationButton = createButton('Go to this location', container);

  L.popup()
      .setContent(container)
      .setLatLng(e.latlng)
      .openOn(map);
  
  L.DomEvent.on(startButton, 'click', function() {
    control.spliceWaypoints(0, 1, e.latlng);
    map.closePopup();
  });

  L.DomEvent.on(destinationButton, 'click', function() {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    map.closePopup();
  });
});

function getColor(type) {
  switch(type) {
    case "Sharrow":
      return "#ff0000";
    case "Conventional":
      return "#ff7b00";
    case "Paint Buffered":
      return "#ffc800";
    case "Separated Bike Lane":
      return "#00ff00";
    default:
      return '#ff00ff';
  }
}

function getStyle(feature) {
  return {
    color: getColor(feature.properties.TYPE),
    opacity: 0.5
  }
}

let geojson;

$.getJSON("https://opendata.arcgis.com/datasets/b5f660b9f0f44ced915995b6d49f6385_0.geojson", function(json) {
  geojson = L.geoJson(json, {style: getStyle}).addTo(map);
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);



function highlightFeature(mouse) {
  let layer = mouse.target;

  layer.setStyle({
    weight: 5,
  });

  layer.bringToFront();
}

function resetHighlight(mouse) {
  
}