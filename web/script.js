
var snap = angular.module('snap', ["angular-mapbox"])
  .factory('DOMelements', function(){
    // useful for setting an element's absolute positioning based on a dynamically positioned element
      // e.g. the header and map elements
    return {
      headerHeight: function(){
        return angular.element(document.querySelector('header'))[0].offsetHeight;
      }
    };
      
  })
  .controller('HeaderCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.userName = 'Martha Stewart';
  }])
  .controller('MapCtrl', ['$scope', 'mapboxService', '$http', 'DOMelements', function ($scope, mapboxService, $http, DOM) {
    mapboxService.init({ accessToken: 'pk.eyJ1IjoiamFtZXMtbGFuZS1jb25rbGluZyIsImEiOiJ3RHBOc1BZIn0.edCFqVis7qgHPRgdq0WYsA' });
    $scope.DOM = DOM;
    $scope.geojson = {};

    $http.get('http://localhost:8000/physical')
      .then(function(res){
        $scope.geojson = res.data;
      });

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
