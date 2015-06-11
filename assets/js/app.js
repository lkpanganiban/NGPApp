//Change 1
var map, featureList, Boundariesearch = [] ,Missingsearch=[],Growingsearch=[],Replantsearch=[],Totalsearch=[], Seedlingsearch=[];
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
  rizalMissingPlants.eachLayer(function (layer) {
    if (map.hasLayer(rizalMissingPlantsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())){
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/miss.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  rizalGrowingPlants.eachLayer(function (layer) {
    if (map.hasLayer(rizalGrowingPlantsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())){
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/grow.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  rizalNewPlants.eachLayer(function (layer) {
    if (map.hasLayer(rizalNewPlantsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())){
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/newlyReplant.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  rizalSeedlingPlants.eachLayer(function (layer) {
    if (map.hasLayer(rizalSeedlingPlantsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())){
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/seeds.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  rizalTotalPlants.eachLayer(function (layer) {
    if (map.hasLayer(rizalTotalPlantsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())){
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/total.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  // /* Loop through Protected Areas layer and add only features which are in the map bounds */
  // CropAreas.eachLayer(function (layer) {
  //   if (map.hasLayer(cropareaLayer)) {
  //     if (map.getBounds().contains(layer.getBounds().getCenter())){
  //       $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getBounds().getCenter().lat + '" lng="' + layer.getBounds().getCenter().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/cropArea.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
  //     }
  //   }
  // });


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

// var imageUrl = 'ortho/boholJPG3.png',
//     imageBounds = L.latLngBounds([[9.5900527778,123.7387444444], [9.5525694444,123.7651027778]]);
// var orthoPhoto = L.imageOverlay(imageUrl, imageBounds);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var highArea;


//var multi = L.multiPolygon(sampleData.features[0].geometry.coordinates[0]);

var highlightArea = L.geoJson(null, {
  style: function (feature) {
    return {
        stroke: true,
        color:"#9CCC65",
        fillColor: "#E91E63",
        fillOpacity: 0.5,
        weight:1
    };
  }
});

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

//---------------------------------------------------------- Rizal Data ----------------------------------------------------------------------
// Rizal Boundaries
var rizalBoundaries = L.geoJson(null, {
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
$.getJSON("json/rizal_admin_bds.geojson",function (data) {
      rizalBoundaries.addData(data);
  });

// Rizal Ortho
var rizalImageUrl = 'ortho/RizalClip11.jpg',
    rizalImageBounds = L.latLngBounds([[14.6976688978895,121.233116047712],[14.6983404070102,121.233726468209]]);

var rizalOrthoPhoto = L.imageOverlay(rizalImageUrl, rizalImageBounds);

// Missing Trees
var rizalMissingPlantsLayer = L.geoJson(null);
var rizalMissingPlants = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/miss.png",
        iconSize: [15,15],
        iconAnchor: [1, 1],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Id,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
                    + "<tr><th>Geocode</th><td>" + feature.properties.Geocode + "</td></tr>" 
                    + "<tr><th>Region</th><td>" + feature.properties.Region + "</td></tr>" 
                    + "<tr><th>Species</th><td>" + feature.properties.Species + "</td></tr>" 
                    + "<tr><th>Date Planted</th><td>" + "<b>" +feature.properties.DatePlante +"</b></td></tr><table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Geocode);
          $("#feature-info").html(content);
          $("#featureModal").modal("show"); 
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/miss.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      
        Missingsearch.push({
        name: layer.feature.properties.Geocode,
        address: layer.feature.properties.Region,
        source: "rizalMissingPlants",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("json/rizal_missing_plants.geojson", function (data) {
  rizalMissingPlants.addData(data);
  map.addLayer(rizalMissingPlantsLayer);
});


// Growing Plants
var rizalGrowingPlantsLayer = L.geoJson(null);
var rizalGrowingPlants = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/grow.png",
        iconSize: [15,15],
        iconAnchor: [1, 1],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Geocode,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
                    + "<tr><th>Geocode</th><td>" + feature.properties.Geocode + "</td></tr>" 
                    + "<tr><th>Region</th><td>" + feature.properties.Region + "</td></tr>" 
                    + "<tr><th>Species</th><td>" + feature.properties.Species + "</td></tr>" 
                    + "<tr><th>Date Planted</th><td>" + "<b>" +feature.properties.DatePlante +"</b></td></tr><table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Geocode);
          $("#feature-info").html(content);
          $("#featureModal").modal("show"); 
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/grow.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      Growingsearch.push({
        name: layer.feature.properties.Geocode,
        address: layer.feature.properties.Region,
        source: "rizalGrowingPlants",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("json/rizal_growing_plants.geojson", function (data) {
  rizalGrowingPlants.addData(data);
  map.addLayer(rizalGrowingPlantsLayer);
});


// New Plants
var rizalNewPlantsLayer = L.geoJson(null);
var rizalNewPlants = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/newlyReplant.png",
        iconSize: [15,15],
        iconAnchor: [1, 1],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Geocode,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
                    + "<tr><th>Geocode</th><td>" + feature.properties.Geocode + "</td></tr>" 
                    + "<tr><th>Region</th><td>" + feature.properties.Region + "</td></tr>" 
                    + "<tr><th>Species</th><td>" + feature.properties.Species + "</td></tr>" 
                    + "<tr><th>Date Planted</th><td>" + "<b>" +feature.properties.DatePlante +"</b></td></tr><table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Geocode);
          $("#feature-info").html(content);
          $("#featureModal").modal("show"); 
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/newlyReplant.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      Replantsearch.push({
        name: layer.feature.properties.Geocode,
        address: layer.feature.properties.Region,
        source: "rizalNewPlants",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("json/rizal_new_plants.geojson", function (data) {
  rizalNewPlants.addData(data);
  map.addLayer(rizalNewPlantsLayer);
});


// Seedling Plants
var rizalSeedlingPlantsLayer = L.geoJson(null);
var rizalSeedlingPlants = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/seeds.png",
        iconSize: [15,15],
        iconAnchor: [1, 1],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Geocode,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
                    + "<tr><th>Geocode</th><td>" + feature.properties.Geocode + "</td></tr>" 
                    + "<tr><th>Region</th><td>" + feature.properties.Region + "</td></tr>" 
                    + "<tr><th>Species</th><td>" + feature.properties.Species + "</td></tr>" 
                    + "<tr><th>Date Planted</th><td>" + "<b>" +feature.properties.DatePlante +"</b></td></tr><table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Geocode);
          $("#feature-info").html(content);
          $("#featureModal").modal("show"); 
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/seeds.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      Seedlingsearch.push({
        name: layer.feature.properties.Geocode,
        address: layer.feature.properties.Region,
        source: "rizalSeedlingPlants",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("json/rizal_seedling_plants.geojson", function (data) {
  rizalSeedlingPlants.addData(data);
  map.addLayer(rizalSeedlingPlantsLayer);
});

// Total Plants
var rizalTotalPlantsLayer = L.geoJson(null);
var rizalTotalPlants = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/total.png",
        iconSize: [15,15],
        iconAnchor: [1, 1],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Geocode,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content ="<table class='table table-striped table-bordered table-condensed'>" 
                    + "<tr><th>Geocode</th><td>" + feature.properties.Geocode + "</td></tr>" 
                    + "<tr><th>Region</th><td>" + feature.properties.Region + "</td></tr>" 
                    + "<tr><th>Species</th><td>" + feature.properties.Species + "</td></tr>" 
                    + "<tr><th>Date Planted</th><td>" + "<b>" +feature.properties.DatePlante +"</b></td></tr><table>";
layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Geocode);
          $("#feature-info").html(content);
          $("#featureModal").modal("show"); 
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/total.png"></td><td class="feature-name">' + layer.feature.properties.Geocode + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      Totalsearch.push({
        name: layer.feature.properties.Geocode,
        address: layer.feature.properties.Region,
        source: "rizalTotalPlants",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("json/rizal_total_plants.geojson", function (data) {
  rizalTotalPlants.addData(data);
  map.addLayer(rizalTotalPlantsLayer);
});


// -------------------------------------------------------- End Rizal ---------------------------------------------------------------------------
map = L.map("map", {
  zoom: 7,
  center: [15.48889, 120.5986],
  layers: [Boundaries, rizalBoundaries, rizalOrthoPhoto, HereDay, markerClusters, highlightArea, highlight],//[mapquestHYB, Boundaries, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false,
  maxZoom:21
});
map.fitBounds(rizalImageBounds);
//map.fitBounds(imageBounds);

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === rizalMissingPlantsLayer) {
    markerClusters.addLayer(rizalMissingPlants);
    syncSidebar();
  }
  if (e.layer === rizalNewPlantsLayer) {
    markerClusters.addLayer(rizalNewPlants);
    syncSidebar();
  }
  if (e.layer === rizalGrowingPlantsLayer) {
    markerClusters.addLayer(rizalGrowingPlants);
    syncSidebar();
  }
   if (e.layer === rizalSeedlingPlantsLayer) {
    markerClusters.addLayer(rizalSeedlingPlants);
    syncSidebar();
  }
  if (e.layer === rizalTotalPlantsLayer) {
    markerClusters.addLayer(rizalTotalPlants);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === rizalMissingPlantsLayer) {
    markerClusters.removeLayer(rizalMissingPlants);
    syncSidebar();
  }
  if (e.layer === rizalGrowingPlantsLayer) {
    markerClusters.removeLayer(rizalGrowingPlants);
    syncSidebar();
  }
  if (e.layer === rizalNewPlantsLayer) {
    markerClusters.removeLayer(rizalNewPlants);
    syncSidebar();
  }
  if (e.layer === rizalSeedlingPlantsLayer) {
    markerClusters.removeLayer(rizalSeedlingPlants);
    syncSidebar();
  }
  if (e.layer === rizalTotalPlantsLayer) {
    markerClusters.removeLayer(rizalTotalPlants);
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
    //"Boundaries": Boundaries,
    "Rizal Boundary": rizalBoundaries,
  },
  "Overlays":{
    "Missing Plants": rizalMissingPlantsLayer,
    "Growing Plants": rizalGrowingPlantsLayer,
    "Newly Replant": rizalNewPlantsLayer,
    "Seedlings": rizalSeedlingPlantsLayer,
    "Total Plant Count": rizalTotalPlantsLayer,
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

  //   var RoadNetworksBH = new Bloodhound({
  //   name: "RoadNetworks",
  //   datumTokenizer: function (d) {
  //     return Bloodhound.tokenizers.whitespace(d.name);
  //   },
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   local: Roadsearch,
  //   limit: 10
  // });

  // var TreesBH = new Bloodhound({
  //   name: "Trees",
  //   datumTokenizer: function (d) {
  //     return Bloodhound.tokenizers.whitespace(d.name);
  //   },
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   local: Treesearch,
  //   limit: 10
  // });

  //   var CropAreasBH = new Bloodhound({
  //   name: "CropAreas",
  //   datumTokenizer: function (d) {
  //     return Bloodhound.tokenizers.whitespace(d.name);
  //   },
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   local: CropAreasearch,
  //   limit: 10
  // });

    //Rizal
    var GrowingBH = new Bloodhound({
    name: "rizalGrowingPlants",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Growingsearch,
    limit: 10
  });

  var MissingBH = new Bloodhound({
    name: "rizalMissingPlants",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Missingsearch,
    limit: 10
  });

  var SeedlingBH = new Bloodhound({
    name: "rizalSeedlingPlants",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Seedlingsearch,
    limit: 10
  });

  var ReplantBH = new Bloodhound({
    name: "rizalNewPlants",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Replantsearch,
    limit: 10
  });

  var TotalBH = new Bloodhound({
    name: "rizalTotalPlants",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: Totalsearch,
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
  // RoadNetworksBH.initialize();
  // TreesBH.initialize();
  // CropAreasBH.initialize();
  GrowingBH.initialize();
  MissingBH.initialize();
  ReplantBH.initialize();
  TotalBH.initialize();
  SeedlingBH.initialize();
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
  },{
    name: "rizalGrowingPlants",
    displayKey: "name",
    source: GrowingBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/grow.png' width='24' height='28'>&nbsp;Growing Plants</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "rizalMissingPlants",
    displayKey: "name",
    source: MissingBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/miss.png' width='24' height='28'>&nbsp;Missing Plants</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "rizalNewPlants",
    displayKey: "name",
    source: ReplantBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/newlyReplant.png' width='24' height='28'>&nbsp;Newly Replanted</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "rizalSeedlingPlants",
    displayKey: "name",
    source: SeedlingBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/seeds.png' width='24' height='28'>&nbsp;Seedling</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "rizalTotalPlants",
    displayKey: "name",
    source: TotalBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/total.png' width='24' height='28'>&nbsp;Total Plants</h4>",
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
    if (datum.source === "rizalMissingPlants") {
      if (!map.hasLayer(rizalMissingPlantsLayer)) {
        map.addLayer(rizalMissingPlantsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
      if (datum.source === "rizalGrowingPlants") {
      if (!map.hasLayer(rizalGrowingPlantsLayer)) {
        map.addLayer(rizalGrowingPlantsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
      if (datum.source === "rizalNewPlants") {
      if (!map.hasLayer(rizalNewPlantsLayer)) {
        map.addLayer(rizalNewPlantsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
      if (datum.source === "rizalTotalPlants") {
      if (!map.hasLayer(rizalTotalPlantsLayer)) {
        map.addLayer(rizalTotalPlantsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
      if (datum.source === "rizalSeedlingPlants") {
      if (!map.hasLayer(rizalSeedlingPlantsLayer)) {
        map.addLayer(rizalSeedlingPlantsLayer);
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

//legend
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        counts = [324, 174, 174, 500, 349],
        labels = ["Missing","Replanted","Growing","Seedling","Total"];
        imgs=["\'assets/img/miss.png\'", "\'assets/img/newlyReplant.png\'", "\'assets/img/grow.png\'", "\'assets/img/seeds.png\'", "\'assets/img/total.png\'"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < counts.length; i++) {
        div.innerHTML += "<span><img src="+imgs[i]+"/><p>"+labels[i]+" : <b>"+counts[i]+"</b></p></span>"
            
    }

    return div;
};

legend.addTo(map);






