  var map3; 
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

  $("#full-extent-btn").click(function() {
    map3.fitBounds(Boundaries.getBounds());
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#list-btn").click(function() {
    $('#sidebar').toggle();
    map3.invalidateSize();
    return false;
  });

  $("#nav-btn").click(function() {
    $(".navbar-collapse").collapse("toggle");
    return false;
  });

  $("#sidebar-toggle-btn").click(function() {
    $("#sidebar").toggle();
    map3.invalidateSize();
    return false;
  });

  $("#sidebar-hide-btn").click(function() {
    $('#sidebar').hide();

    map3.invalidateSize();
  });

  function clearHighlight() {
    highlight.clearLayers();
  }

  function sidebarClick(id) {
    var layer = markerClusters.getLayer(id);
    map3.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
    layer.fire("click");
    /* Hide sidebar and go to the map3 on small screens */
    if (document.body.clientWidth <= 767) {
      $("#sidebar").hide();
      map3.invalidateSize();
    }
  }


  /* Basemap3 Layers */
  var map3questOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    attribution: 'Tiles courtesy of <a href="http://www.map3quest.com/" target="_blank">map3Quest</a> <img src="http://developer.map3quest.com/content/osm/mq_logo.png">. map3 data (c) <a href="http://www.openstreetmap3.org/" target="_blank">OpenStreetmap3</a> contributors, CC-BY-SA.'
  });
  var map3questOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
   subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    attribution: 'Tiles courtesy of <a href="http://www.map3quest.com/" target="_blank">map3Quest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
  });
  var map3questHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
  }), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    attribution: 'Labels courtesy of <a href="http://www.map3quest.com/" target="_blank">map3Quest</a> <img src="http://developer.map3quest.com/content/osm/mq_logo.png">. map3 data (c) <a href="http://www.openstreetmap3.org/" target="_blank">OpenStreetmap3</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
  })]);

  /* Overlay Layers */
  var highlight = L.geoJson(null);
  var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
  };


  /* Single marker cluster layer to hold all clusters */
  var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 16
  });

  /* Empty layer placeholder to add to layer control for listening when to add/remove Investments to markerClusters layer */
  var ecoLayer = L.geoJson(null);
  var ecoes = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: "assets/img/eco.png",
          iconSize: [24, 28],
          iconAnchor: [12, 28],
          popupAnchor: [0, -25]
        }),
        title: feature.properties.Destination,
        riseOnHover: true
      });
    },
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Destination</th><td>" + feature.properties.Destination + "</td></tr>" + "<tr><th>Accommodation</th><td>" + feature.properties.Accommodation + "</td></tr>"+"<tr><th>Contact</th><td>" + feature.properties.Contact + "</td></tr>"+"<tr style="+'"'+"height:100px;"+'"'+"><th>Fees</th><td style="+'"'+"word-wrap:break-word;overflow-y:visible;"+'"'+">" + feature.properties.Fees + "</td></tr>" + "<table>";
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.Destination);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
            highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
          }
        });
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/eco.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
        // ecosearch.push({
        //   name: layer.feature.properties.name,
        //   address: layer.feature.properties.type,
        //   source: "ecoes",
        //   id: L.stamp(layer),
        //   lat: layer.feature.geometry.coordinates[1],
        //   lng: layer.feature.geometry.coordinates[0]
        // 
        // });
      }
    }
  });
  $.getJSON("geojson_tarlac/tourinfo.geojson", function (data) {
    ecoes.addData(data);
  });


map3 = L.map("map3", {
    zoom: 10,
    center: [15.48889, 120.5986],
    layers: [map3questOSM, markerClusters, highlight],
    zoomControl: false,
    attributionControl: false
  });

map3.on("overlayadd", function(e) {
    if (e.layer === ecoLayer) {
    markerClusters.addLayer(ecoes);
  }});
map3.on("overlayremove", function(e) {
  if (e.layer === ecoLayer) {
    markerClusters.removeLayer(ecoes);
  }});

  /* Clear feature highlight when map3 is clicked */
  map3.on("click", function(e) {
    highlight.clearLayers();
  });

  var zoomControl = L.control.zoom({
    position: "bottomright"
  }).addTo(map3);

  /* Larger screens get expanded layer control and visible sidebar */
  if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
  } else {
    var isCollapsed = false;
  }


  var baseLayers = {
    "Street map": map3questOSM,
    "Aerial Imagery": map3questOAM,
    "Imagery with Streets": map3questHYB
  };

  var groupedOverlays = {
    "Points of Interest": {
      "<img src='assets/img/eco.png' width='24' height='28'>&nbsp;Eco-Sites": ecoLayer
    }
  };

  var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: isCollapsed
  }).addTo(map3);

  var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
            attr ='Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            service = new L.TileLayer(url, {subdomains:"1234",attribution: attr});

            var el = L.control.elevation({position: "topleft"});
            el.addTo(map3);

            var g=new L.GPX("data/bungkol.2.gpx", {
              async: true,
              marker_options: {
                  startIconUrl: 'assets/leaflet-gpx/pin-icon-start.png',
                  endIconUrl: 'assets/leaflet-gpx/pin-icon-end.png',
                  shadowUrl: 'assets/leaflet-gpx/pin-shadow.png'
                }
            });
            g.on('loaded', function(e) {
                  map3.fitBounds(e.target.getBounds());
            });
            g.on("addline",function(e){
              el.addData(e.line);
            });
            g.on("mouseover",function(e){
              var popup = L.popup()
                .setLatLng([15.41758611,120.3942667])
                .setContent("Mt. Bungkol Baka Trail")
                .openOn(map3);
            });
            g.addTo(map3);
            map3.addLayer(service);

