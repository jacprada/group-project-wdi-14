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
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

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
      // console.log(bar.name);
      // console.log(bar.lat);
      // console.log(bar.lng);
      // Setting up marker based on json bar (name, lat, lng) data
      // var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
      var marker = new google.maps.Marker({
        position: {lat: bar.lat, lng: bar.lng},
        map: map,
        title: bar.name,
        icon: "http://i.imgur.com/jcZ8P11.png"
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