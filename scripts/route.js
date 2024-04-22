// init map

let map = L.map('map', {
  minZoom: 11
}).setView([39.95, -75.165], 13);

// init tile layer

// street: http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}
// satellite: http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}

L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

// init search and router

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
    addWaypoints: false,
    styles:[{color: "white", weight: 4}, {color: 'red', weight: 2}]
  },
  
}).addTo(map);

L.Routing.errorControl(control).addTo(map);

// init legend

let types = {
  "Sharrows": "#fe797b",
  "Bus Lane": "#ffb750",
  "Conventional": "#ffea56",
  "Buffered": "#8fe968",
  "Protected": "#36cedc"
}

let colorGroups = {
  "#fe797b": L.layerGroup(),
  "#ffb750": L.layerGroup(),
  "#ffea56": L.layerGroup(),
  "#8fe968": L.layerGroup(),
  "#36cedc": L.layerGroup()
}

let legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
  let div = L.DomUtil.create('div', 'legend');
  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);
  
  for (const key in types) {
    div.innerHTML += '<input class="legend-checkbox" id="' + types[key] + '" type="checkbox" checked><span style="background:' 
      + types[key] + ';">' + key + '</span></input><br>';
  }
  div.innerHTML += '<button id="toggle-legend-btn">hide &#x2715;</button>';
  return div;
}

$(function(){
  let checkboxes = document.getElementsByClassName("legend-checkbox");
  for (let checkbox of checkboxes) {
    checkbox.onclick = function() {
      if (checkbox.checked === false) {
        map.removeLayer(colorGroups[checkbox.id]);  
      } else {
        map.addLayer(colorGroups[checkbox.id]);  
      }
    }
  }
});

legend.addTo(map);

document.getElementById("toggle-legend-btn").onclick = function() {
  if (this.innerHTML.includes("hide")) {
    this.innerHTML = "show";
    this.style.right = "0px";
    this.style.bottom = "0px";
    let legend = document.getElementsByClassName("legend")[0];
    legend.style.height = "30px";
    legend.style.width = "64px";
  } else {
    this.innerHTML = "hide &#x2715;";
    this.style.right = "3px";
    this.style.bottom = "3px";
    let legend = document.getElementsByClassName("legend")[0];
    legend.style.height = "142px";
    legend.style.width = "auto";
  }
}

// init popup button

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
  let addButton;
  if (control.getWaypoints()[0].latLng !== undefined) {
    addButton = L.DomUtil.create('button', '', container);
    addButton.innerHTML = 'Add location as stop';
  }
  let destinationButton = L.DomUtil.create('button', 'go-to-btn', container);
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

// init bike lanes on map

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
    lineCap: "butt",
  }
}

map.on('zoomend', function() {
  let currentZoom = map.getZoom();
  geojson.setStyle({weight: currentZoom-8})
});

function onEachFeature(feature, layer) {
  colorGroups[layer.options.color].addLayer(layer);
}

let geojson;

$.getJSON("./resources/bike_network.geojson", function(json) {
  geojson = L.geoJson(json, {
    style: style,
    onEachFeature: onEachFeature
  });
  for (let key in colorGroups) {
    colorGroups[key].addTo(map);
  }
});
