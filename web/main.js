require('mapbox.js'); // auto-attaches to window.L 

L.mapbox.accessToken = 'pk.eyJ1IjoiamFtZXMtbGFuZS1jb25rbGluZyIsImEiOiJ3RHBOc1BZIn0.edCFqVis7qgHPRgdq0WYsA';
var map = L.mapbox.map('map', 'mapbox.streets', );
  .setView([40, -174.50], 9);
