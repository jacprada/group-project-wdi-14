$(document).ready(function(){
  initialize();
});

var infowindow;
var marker;

function initialize() {

    $(document).foundation();
    $('a.custom-close-reveal-modal').click(function(){
        $('#about').foundation('reveal', 'close');
        $('#login_div').foundation('reveal', 'close');
    });

  // Getting the map div in the html file
  var mapCanvas = document.getElementById('map');
  // Setting up map options to render map of London
  var center = new google.maps.LatLng(51.517557, -0.095624);

  var style_black = [{"featureType": "all", "elementType": "labels.text.fill", "stylers": [{"saturation": 36},{"color": "#000000"},{"lightness": 40}]},{"featureType": "all", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"},{"color": "#000000"},{"lightness": 16}]},{"featureType": "all", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},{"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 21}]},{"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#000000"},{"lightness": 17}]},{"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 18}]},{"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 16}]},{"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 19}]},{"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 17}]}]

  var mapOptions = {
    center: center,
    zoom: 13,
    styles: style_black,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapMaker: true,
    mapTypeControl: false,
    streetViewControl: false,
    panControl: false,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.LEFT_TOP
  }
}

  // Rendering desired map in selected div
  window.map = new google.maps.Map(mapCanvas, mapOptions);

  // Create a new StyledMapType object, passing it the array of styles, ***
  // as well as the name to be displayed on the map type control.
  $('#switch').click(function() {
    var style_black = [{"featureType": "all", "elementType": "labels.text.fill", "stylers": [{"saturation": 36},{"color": "#000000"},{"lightness": 40}]},{"featureType": "all", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"},{"color": "#000000"},{"lightness": 16}]},{"featureType": "all", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},{"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 21}]},{"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#000000"},{"lightness": 17}]},{"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 18}]},{"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 16}]},{"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 19}]},{"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#000000"},{"lightness": 17}]}]
    var style_white = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#e5e5e5"},{"visibility":"on"}]}]
    var check_style = $('#exampleCheckboxSwitch')
    if (check_style.is(':checked')) {
      window.map.setOptions({styles: style_white});
    } else {
      window.map.setOptions({styles: style_black});
    }
  }) 

  google.maps.event.addDomListener(window, 'resize', function() {
    window.map.setCenter(center);
  });

  google.maps.event.addListenerOnce(map, 'idle', function(){
    setTimeout(function(){
        if (localStorage.getItem("access_token") !== null) {
          addBars();
      }
  }, 200); 
});

}

function addBars(){
  // Making ajax call to back-end in order to retrieve json bar data
  var ajax = $.ajax({
    type: "get",
    url: 'https://floating-sea-7710.herokuapp.com/bars',
    dataType: "json",
    beforeSend: function(request){
      checkAccess(request)
  },
}).done(function(data){
    $.each(data, function(index, bar){
      (function(){
        setTimeout(function() {
          addBar(bar);
      }, (index+1) * 200);
    }(bar, index));
  });
});
}

function addBar(bar, index) {
  // Setting up marker based on json bar (name, lat, lng) data
  // var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  var marker = new google.maps.Marker({
    position: {lat: bar.lat, lng: bar.lng},
    map: window.map,
    title: bar.name,
    animation: google.maps.Animation.DROP,
    icon: "http://i.imgur.com/mKPqLrX.png"
});
  
  // Setting up info window based on json bar (name, image, description, facebook) data
  // Adding Citymapper link with pre-saved adddress

  // Adding click listener to open info window when marker is clicked
  marker.addListener('click', function(){
    markerClick(marker, bar);
});  
}

function markerClick(marker, bar) {
  if(infowindow) infowindow.close();

  infowindow = new google.maps.InfoWindow({
    content: '<div id="map_window">'+
    '<h2 id="map_title">' + bar.name + '</h2>'+
    '<div id="map_content">'+
    '<div class="bar_image" style="background-image: url('+ bar.image +')"></div>' +
    '<p id="map_address">' + bar.address + '</p>' +
    '<p id="map_description">' + bar.description + '</p>' +
    '<a href="https://citymapper.com/directions?endcoord='
    + bar.lat + ',' + bar.lng + '&endname=' + bar.name +'" target="_blank"><img class="citymapper" src="../images/custom-citymapper.png"></a>' +
    '</div>'+
    '</div>'
});

  window.map.setCenter(marker.getPosition());
  infowindow.open(window.map, marker);
};