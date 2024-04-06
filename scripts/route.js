let map = L.map('map', {
  minZoom: 11
}).setView([39.95, -75.165], 13);

// street: http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}
// satellite: http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}

L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

let control = L.Routing.control({
  geocoder: L.Control.Geocoder.photon({
    geocodingQueryParams: {
      lat: "39.95",
      lon: "-75.165",
    }
  }),
  reverseWaypoints: true,
  router: L.Routing.mapzen('', {
    costing:'bicycle'
  }),
  formatter: new L.Routing.mapzenFormatter({
    units: 'imperial'
  }),
  lineOptions: {
    addWaypoints: false
  },
}).addTo(map);

L.Routing.errorControl(control).addTo(map);

let legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
  let div = L.DomUtil.create('div', 'legend');
  let types = {
    "Sharrows": "#fe797b",
    "Bus Lane": "#ffb750",
    "Conventional": "#ffea56",
    "Buffered": "#8fe968",
    "Protected": "#36cedc"
  }
  for (const key in types) {
    div.innerHTML += '<i style="background:' + types[key] + '"></i> ' + key + '<br>';
  }
  return div;
}

legend.addTo(map);

function createButton(label, container) {
  var btn = L.DomUtil.create('button', '', container);
  btn.setAttribute('type', 'button');
  btn.innerHTML = label;
  return btn;
}

map.on('click', function(e) {
  console.log(control.getWaypoints());
  let container = L.DomUtil.create('div', 'popup');
  let startButton = L.DomUtil.create('button', '', container);
  startButton.innerHTML = 'Start from this location';
  let addButton;
  if (control.getWaypoints()[0].latLng !== undefined) {
    addButton = L.DomUtil.create('button', '', container);
    addButton.innerHTML = 'Add location as stop';
  }
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

  if (addButton !== undefined) {
    L.DomEvent.on(addButton, 'click', function() {
      control.spliceWaypoints(control.getWaypoints().length - 1, 0, e.latlng);
      map.closePopup();
    })
  }

  L.DomEvent.on(destinationButton, 'click', function() {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    map.closePopup();
  });
});

function getColor(type) {
  switch(type) {
    case "Sharrow":
      return "#fe797b";
    case "Bus Bike Lane":
      return "#ffb750";
    case "Conventional":
    case "Conventional w Sharrows":
    case "Dashed Bike Lane":
    case "Conventional & Dashed Bike Lane":
    case "Contraflow":
      return "#ffea56";
    case "Paint Buffered":
    case "Paint Buffered w Conventional":
    case "Two Way Paint Buffered Bike Lane":
      return "#8fe968";
    case "Separated Bike Lane":
    case "One Way Separated Bike Lane":
    case "Two Way Separated Bike Lane":
      return "#36cedc";
    default:
      return 'transparent';
  }
}

function style(feature) {
  return {
    color: getColor(feature.properties.TYPE),
    weight: 5,
    opacity: 0.6,
    lineCap: "butt"
  }
}

map.on('zoomend', function() {
  let currentZoom = map.getZoom();
  geojson.setStyle({weight: currentZoom-9, opacity: 1-((currentZoom-5)/20)})
});

let geojson;

$.getJSON("./resources/bike_network.geojson", function(json) {
  geojson = L.geoJson(json, {
    style: style,
  }).addTo(map);
});