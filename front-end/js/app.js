$(document).ready(function(){
  initialize();
});

function initialize() {
  var mapCanvas = document.getElementById('map');

  var mapOptions = {
    center: new google.maps.LatLng(51.517557, -0.095624),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapMaker: true
  }

  var map = new google.maps.Map(mapCanvas, mapOptions);

  var ajax = $.get('http://localhost:9000/')
  .done(function(data){
    $.each(data, function(index, bar){
      console.log(bar.name);
      console.log(bar.lat);
      console.log(bar.lng);
      var marker = new google.maps.Marker({
        position: {lat: bar.lat, lng: bar.lng},
        map: map,
        title: bar.name
      });
      var infowindow = new google.maps.InfoWindow({
        content: '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h2 id="firstHeading" class="firstHeading">' + bar.name + '</h2>'+
        '<div id="bodyContent">'+
        '<img src="' + bar.image + '" height="200px">' +
        '<p>' + bar.description + '</p>' +
        '<a href="' + bar.facebook_url + '" target="_blank">Facebook</a><br>' +
        '<a href="https://citymapper.com/directions?endcoord=' + bar.lat + ',' + bar.lng + '&endname=' + bar.name +'" target="_blank">Get There</a>' +
        '</div>'+
        '</div>'
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    });
  });

}