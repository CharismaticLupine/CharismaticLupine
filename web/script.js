
var snap = angular.module('snap', ["leaflet-directive"])
  .factory('DOMelements', function(){
    // useful for setting an element's absolute positioning based on a dynamically positioned element
      // e.g. the header and map elements
    var headerHeight = function(){
      return angular.element(document.querySelector('header'))[0].offsetHeight;
    };
    var sidebarWidth = function(){
      return angular.element(document.querySelector('#sidebar'))[0].offsetWidth;
    };

    return { 
      headerHeight: headerHeight,
      sidebarWidth: sidebarWidth
    }; 
  })
  .factory('Physicals', ['$http', function($http){
    var getBbox = function(bbox){
      // bbox should be an array of [xmin, ymin, xmax, ymax]
      return $http({
        method: 'GET',
        url: 'http://localhost:8000/physical/bbox/' + bbox.join(',')
      })
      .then(function(res){
        return res.data;
      });
    };

    return { getBbox: getBbox };
  }])
  .factory('Map', ['Physicals', 'leafletData', function(Physicals, leafletData){
    var Map = {
      loadBbox: function(bbox){
        return Physicals.getBbox(bbox);
      },

      geoJSON2Markers: function(geojson){
        var markers = {}
        geojson.features.forEach(function(feature){
          markers[feature.properties.id] = {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
          };
        });
        return markers;
      },

      load: function(){
        return leafletData.getMap().then(function(map){
          var bounds = map.getBounds();
          return Map.loadBbox([bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()])
        });
      },
    };

    return Map;
  }])
  .controller('HeaderCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.userName = 'Martha Stewart';
  }])
  .controller('MapCtrl', [
    '$scope',
    '$rootScope',
    'leafletData', 
    'Map',
    'leafletEvents',
    'DOMelements',
    function ($scope, $rootScope, leafletData, Map, leafletEvents, DOM) {
      $scope.DOM = DOM;

      angular.extend($scope, {
        defaults: {
          tileLayer: "https://api.mapbox.com/v4/james-lane-conkling.5630f970/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamFtZXMtbGFuZS1jb25rbGluZyIsImEiOiJ3RHBOc1BZIn0.edCFqVis7qgHPRgdq0WYsA",
        },
        center: {
          lat: 37.78,
          lng: -122.45,
          zoom: 15
        }
      });

      $scope.refresh = function(){
        Map.load().then(function(geojson){
          $rootScope.geojson = geojson;
          angular.extend($scope, {
            markers: angular.copy(Map.geoJSON2Markers(geojson))
          });
        });
      };

      $scope.refresh();

      $scope.$on('leafletDirectiveMap.moveend', function(e){
        $scope.refresh();
      });
    }
  ])
  .controller('SidebarCtrl', ['$scope', 'Physicals', 'DOMelements', function($scope, Physicals, DOM){
    $scope.DOM = DOM;
  }])

// (function(){

// var app = {
//   url : 'http://localhost:8000/',
//   init: function(){
//     L.mapbox.accessToken = 'pk.eyJ1IjoiamFtZXMtbGFuZS1jb25rbGluZyIsImEiOiJ3RHBOc1BZIn0.edCFqVis7qgHPRgdq0WYsA';
//     app.map = L.mapbox.map('map', 'mapbox.streets')
//       .setView([37.78, -122.45], 13);

//     app.svg = d3.select(app.map.getPanes().overlayPane).append("svg");
//     app.g = app.svg.append("g").attr("class", "leaflet-zoom-hide");

//     app.loadData();
//   },

//   loadData: function(){
//     d3.json(app.url + 'physical', function(collection){
//       var feature = app.g.selectAll("path")
//         .data(collection.features)
//         .enter().append("path");

//       var transform = d3.geo.transform({point: function projectPoint(x, y) {
//         var point = app.map.latLngToLayerPoint( new L.LatLng(y, x) );
//         this.stream.point(point.x, point.y);
//       }});

//       path = d3.geo.path().projection(transform);

//       app.map.on('viewreset', setPointGeometry);
//       setPointGeometry();

//       function setPointGeometry(){
//         var bounds = path.bounds(collection),
//             topLeft = bounds[0],
//             bottomRight = bounds[1];

//         app.svg.attr("width", bottomRight[0] - topLeft[0])
//            .attr("height", bottomRight[1] - topLeft[1])
//            .style("left", topLeft[0] + "px")
//            .style("top", topLeft[1] + "px");

//         app.g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

//         feature.attr("d", path);
//       }
//     });
//   },

//   getBbox: function(){
//     var xmin = app.map.getBounds().getWest(),
//         ymin = app.map.getBounds().getSouth(),
//         xmax = app.map.getBounds().getEast(),
//         ymax = app.map.getBounds().getNorth();
//     return [xmin, ymin, xmax, ymax];
//   }

// };

// window.app = app;
// app.init();

// })()
