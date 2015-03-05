var map, featureList, Boundariesearch = [], Treesearch = [], Protectedareasearch = [];
$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#contact-btn").click(function() {
  $("#contactModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(Boundaries.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});


$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();

  map.invalidateSize();
});

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);

  var type = layer.feature.geometry.type;

  if(type === "Point"){
    //For Point
    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 20);
  }else if (type === "MultiPolygon"){
    //for MultiPolygon
    map.setView([layer.getBounds().getCenter().lat, layer.getBounds().getCenter().lng], 20);  
  }

  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();

  /* Loop through Monitored Tree layer and add only features which are in the map bounds */
  Trees.eachLayer(function (layer) {
    if (map.hasLayer(treeLayer)) {
      if (map.getBounds().contains(layer.getLatLng())){
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/TreeIcon.png"></td><td class="feature-name">' + layer.feature.properties.Id + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  /* Loop through Protected Areas layer and add only features which are in the map bounds */
  ProtectedAreas.eachLayer(function (layer) {
    if (map.hasLayer(protectedLayer)) {
      if (map.getBounds().contains(layer.getBounds().getCenter())){
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getBounds().getCenter().lat + '" lng="' + layer.getBounds().getCenter().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/eco.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });


  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}


/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var Esri = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var HereDay = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/satellite.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
  attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
  subdomains: '1234',
  mapID: 'newest',
  app_id: 'Y8m9dK2brESDPGJPdrvs',
  app_code: 'dq2MYIvjAotR8tHvY8Q_Dg',
  base: 'aerial',
  minZoom: 0,
  maxZoom: 20
});

var imageUrl = 'ortho/boholJPG3.png',
    imageBounds = L.latLngBounds([[9.5900527778,123.7387444444], [9.5525694444,123.7651027778]]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

//Bohol Boundaries
var Boundaries = L.geoJson(null, {
  style: function (feature) {
    return {
      color:"#FFB300",
      fill: false,
      opacity: 1,
      clickable: false,
      weight: 2
    };
  },
  onEachFeature: function (feature, layer) {
    Boundariesearch.push({
      name: layer.feature.properties.CITY_NAME,
      source: "Boundaries",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("json/Bohol_Municipality_simplified.geojson",function (data) {
      Boundaries.addData(data);
  });


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 19
});

/* Empty layer placeholder to add to layer control for listening when to add/remove Hospitals to markerClusters layer */
var treeLayer = L.geoJson(null);
var Trees = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/TreeIcon.png",
        iconSize: [24, 30],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Id,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
                    + "<tr><th>Id</th><td>" + feature.properties.Id + "</td></tr>" 
                    + "<tr><th>Vegetation</th><td>" + feature.properties.Vegetation + "</td></tr>" 
                    + "<tr><th>Seedlings</th><td>" + feature.properties.Seedlings + "</td></tr>" 
                    + "<tr><th>Crop Age</th><td>" + "<b>" +feature.properties.MonthsOld +"</b></td></tr>" 
                    + "<tr><th>Harvest Date</th><td>" + "<b>" +feature.properties.Harvest_da +"</b></td></tr>" 
                    + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Id);
          $("#feature-info").html(content);
          $("#featureModal").modal("show"); 
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/TreeIcon.png"></td><td class="feature-name">' + layer.feature.properties.Id + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      Treesearch.push({
        name: layer.feature.properties.Id,
        address: layer.feature.properties.Vegetation,
        source: "Hospitals",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("json/Monitored_Trees.geojson", function (data) {
  Trees.addData(data);
  map.addLayer(treeLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove Hospitals to markerClusters layer */
var protectedLayer = L.geoJson(null);
var ProtectedAreas = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/eco.png",
        iconSize: [24, 30],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
                    + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" 
                    + "<tr><th>Layer</th><td>" + feature.properties.LAYER + "</td></tr>" 
                    + "<tr><th>Perimeter</th><td>" + feature.properties.PERIMETER + "</td></tr>" 
                    + "<tr><th>Enclosed Area</th><td>" + "<b>" +feature.properties.ENCLOSED_A +"</b></td></tr>" 
                    + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show"); 
          highlight.clearLayers().addLayer(L.circleMarker([layer.getBounds().getCenter().lat, layer.getBounds().getCenter().lng], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getBounds().getCenter().lat + '" lng="' + layer.getBounds().getCenter().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/eco.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      Protectedareasearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.LAYER,
        source: "ProtectedAreas",
        id: L.stamp(layer),
        lat: layer.getBounds().getCenter().lat,
        lng: layer.getBounds().getCenter().lng
      });
    }
  }
});
$.getJSON("json/Bohol_Panglao.geojson", function (data) {
  ProtectedAreas.addData(data);
  map.addLayer(protectedLayer);
});

var orthoPhoto = L.imageOverlay(imageUrl, imageBounds);

map = L.map("map", {
  zoom: 10,
  center: [15.48889, 120.5986],
  layers: [orthoPhoto, Boundaries, HereDay, markerClusters, highlight],//[mapquestHYB, Boundaries, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false,
  maxZoom:20
});

map.fitBounds(imageBounds);





/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === treeLayer) {
    markerClusters.addLayer(Trees);
    syncSidebar();
  }
  if (e.layer === protectedLayer) {
    markerClusters.addLayer(ProtectedAreas);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === treeLayer) {
    markerClusters.removeLayer(Trees);
    syncSidebar();
  }
  if (e.layer === protectedLayer) {
    markerClusters.removeLayer(ProtectedAreas);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "icon-direction",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": mapquestOSM,
  "Esri Imagery": Esri,
  "Here Satellite": HereDay
};

var groupedOverlays = {
  "Reference": {
    "Boundaries": Boundaries,
    "Protected Areas": protectedLayer 
  },
  "Overlays":{
    "Monitored Trees": treeLayer
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  /* Fit map to Boundaries bounds */
  //map.fitBounds(Boundaries.getBounds());

  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var BoundariesBH = new Bloodhound({
    name: "Boundaries",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Boundariesearch,
    limit: 10
  });

  var TreesBH = new Bloodhound({
    name: "Trees",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Treesearch,
    limit: 10
  });

    var ProtectedAreasBH = new Bloodhound({
    name: "ProtectedAreas",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Protectedareasearch,
    limit: 10
  });


  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  BoundariesBH.initialize();
  TreesBH.initialize();
  ProtectedAreasBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Boundaries",
    displayKey: "name",
    source: BoundariesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Boundaries</h4>"
    }
  }, {
    name: "Trees",
    displayKey: "name",
    source: TreesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/TreeIcon.png' width='24' height='28'>&nbsp;Monitored Trees</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "ProtectedAreas",
    displayKey: "name",
    source: ProtectedAreasBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/eco.png' width='24' height='28'>&nbsp;Protected Areas</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },{
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boundaries") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Trees") {
      if (!map.hasLayer(treeLayer)) {
        map.addLayer(treeLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "ProtectedAreas") {
      if (!map.hasLayer(protectedLayer)) {
        map.addLayer(protectedLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});






