$(document).ready(function(){
  initialize();
});

function initialize() {
  // Getting the map div in the html file
  var mapCanvas = document.getElementById('map');

  // Setting up map options to render map of London
  var mapOptions = {
    center: new google.maps.LatLng(51.517557, -0.095624),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapMaker: true
  }

  // Rendering desired map in selected div
  var map = new google.maps.Map(mapCanvas, mapOptions);

  // Making ajax call to back-end in order to retrieve json bar data
  var ajax = $.get('http://localhost:9000/')
  .done(function(data){
    $.each(data, function(index, bar){
      // console.log(bar.name);
      // console.log(bar.lat);
      // console.log(bar.lng);

      // Setting up marker based on json bar (name, lat, lng) data
      var marker = new google.maps.Marker({
        position: {lat: bar.lat, lng: bar.lng},
        map: map,
        title: bar.name
      });

      // Setting up info window based on json bar (name, image, description, facebook) data
      // Adding Citymapper link with pre-saved adddress
      var infowindow = new google.maps.InfoWindow({
        content: '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h2 id="firstHeading" class="firstHeading">' + bar.name + '</h2>'+
        '<div id="bodyContent">'+
        '<img src="' + bar.image + '" height="200px">' +
        '<p>' + bar.description + '</p>' +
        '<a href="' + bar.facebook_url + '" target="_blank">Facebook</a><br>' +
        '<a href="https://citymapper.com/directions?endcoord='
        + bar.lat + ',' + bar.lng + '&endname=' + bar.name +'" target="_blank">Get There</a>' +
        '</div>'+
        '</div>'
      });

      // Adding click listener to open info window when marker is clicked
      marker.addListener('click', function() {
        map.setCenter(marker.getPosition());
        infowindow.open(map, marker);
      });
    });
  });

}