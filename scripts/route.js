let map = L.map('map', {
  minZoom: 11,
}).setView([39.95, -75.165], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let control = L.Routing.control({
  geocoder: L.Control.Geocoder.photon({
    geocodingQueryParams: {
      lat: "39.95",
      lon: "-75.165"
    }
  }),
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

  let container = L.DomUtil.create('div', 'popup');
  let startButton = L.DomUtil.create('button', '', container);
  startButton.innerHTML = 'Start from this location';
  let destinationButton = L.DomUtil.create('button', '', container);
  destinationButton.innerHTML = 'Go to this location';

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

function style(feature) {
  return {
    color: getColor(feature.properties.TYPE),
    opacity: 0.5,
    weight: 5,
    lineCap: "butt"
  }
}

function onEachFeature(feature, layer) {
  map.on('zoomend', function() {
    let currentZoom = map.getZoom();
    console.log(currentZoom);
    if (currentZoom < 13) {
      layer.setStyle({weight: 2});
    } else if (currentZoom < 15) {
      layer.setStyle({weight: 5});
    } else {
      layer.setStyle({weight: 7});
    }
  });

  
}

let geojson;

$.getJSON("https://opendata.arcgis.com/datasets/b5f660b9f0f44ced915995b6d49f6385_0.geojson", function(json) {
  geojson = L.geoJson(json, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
});