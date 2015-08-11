var app = {
  init: function(){
    L.mapbox.accessToken = 'pk.eyJ1IjoiamFtZXMtbGFuZS1jb25rbGluZyIsImEiOiJ3RHBOc1BZIn0.edCFqVis7qgHPRgdq0WYsA';
    app.map = L.mapbox.map('map', 'mapbox.streets')
      .setView([37.78, -122.45], 13);
  }
}

app.init();
