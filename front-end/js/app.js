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

  var mapOptions = {
    center: center,
    zoom: 13,
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

  // Adding array of styles
  var styles = [
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [
    {
        "saturation": 36
    },
    {
        "color": "#000000"
    },
    {
        "lightness": 40
    }
    ]
},
{
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
    {
        "visibility": "on"
    },
    {
        "color": "#000000"
    },
    {
        "lightness": 16
    }
    ]
},
{
    "featureType": "all",
    "elementType": "labels.icon",
    "stylers": [
    {
        "visibility": "off"
    }
    ]
},
{
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 20
    }
    ]
},
{
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 17
    },
    {
        "weight": 1.2
    }
    ]
},
{
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 20
    }
    ]
},
{
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 21
    }
    ]
},
{
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 17
    }
    ]
},
{
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 29
    },
    {
        "weight": 0.2
    }
    ]
},
{
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 18
    }
    ]
},
{
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 16
    }
    ]
},
{
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 19
    }
    ]
},
{
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
    {
        "color": "#000000"
    },
    {
        "lightness": 17
    }
    ]
}
]

  // Create a new StyledMapType object, passing it the array of styles, ***
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

  //Associate the styled map with the MapTypeId and set it to display. ***
  window.map.mapTypes.set('map_style', styledMap);
  window.map.setMapTypeId('map_style');

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
    url: 'http://localhost:3000/bars',
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
    '<div id="siteNotice">'+
    '</div>'+
    '<h2 id="map_content" class="firstHeading">' + bar.name + '</h2>'+
    '<div id="map_content">'+
    '<img id="map_image" src="' + bar.image + '" height="200px">' +
    '<p id="map_description">' + bar.description + '</p>' +
    '<a id="map_facebook href="' + bar.facebook_url + '" target="_blank">Facebook</a><br>' +
    '<a id="map_citymapper href="https://citymapper.com/directions?endcoord='
    + bar.lat + ',' + bar.lng + '&endname=' + bar.name +'" target="_blank">Get There</a>' +
    '</div>'+
    '</div>'
});

  window.map.setCenter(marker.getPosition());
  infowindow.open(window.map, marker);
};