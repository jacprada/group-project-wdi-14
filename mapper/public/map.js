// $(function(){
//   var map;
//   var infowindow;
//   function addInfoWindowForCamera(club, marker){
//     google.maps.event.addListener(marker, 'click', function() {
//       file = club.image;
//       if(infowindow != undefined) infowindow.close()
//       infowindow = new google.maps.InfoWindow({
//           content: "<img src='"file"'"
//       });
      
//       infowindow.open(map,this);
//     });
//   }

//   function createMarkerForCamera(club){
      
//       var latlng = new google.maps.LatLng(club.address);
//       marker = new google.maps.Marker({
//         position: latlng,
//         map: map,
//         title:"Hello World!",
//       });
//       addInfoWindowForCamera(club, marker)
//   }


//   function mapCameras(clubs){
//     $.each(clubs, function(i, club){
      
//       createMarkerForCamera(club)
//     })
//   }

//   function initialize(){
//     var mapOptions = {
//       zoom: 13,
//       center: new google.maps.LatLng(51.517557,-0.095624),
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//     map = new google.maps.Map(document.getElementById("map"), mapOptions);
//     $.ajax({
//       type: 'GET',
//       url: "http://localhost:9000/",
//       dataType: 'json',
//       success: mapCameras
//     })
//   }

//   initialize()
// });


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

  // var contentString = '<div id="content">'+
  //       '<div id="siteNotice">'+
  //       '</div>'+
  //       '<h2 id="firstHeading" class="firstHeading">Second Home</h2>'+
  //       '<div id="bodyContent">'+
  //       '<p><b>Second Home</b> provides beautiful private studios for creative companies' +
  //       'as well as tranquil space for individuals and small teams to flourish.</p>' +
  //       '<a href="https://citymapper.com/directions?endcoord=51.520257,-0.070272&endname=Second%20Home" target="_blank">Get There</a>' +
  //       '</div>'+
  //       '</div>';

  var ajax = $.get('http://localhost:9000/')
  .done(function(data){
    $.each(data, function(index, club){
      console.log(club.name);
      console.log(club.lat);
      console.log(club.lng);
      var marker = new google.maps.Marker({
          position: {lat: club.lat, lng: club.lng},
          map: map,
          title: club.name
        });
      var infowindow = new google.maps.InfoWindow({
          content: '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h2 id="firstHeading" class="firstHeading">' + club.name + '</h2>'+
          '<div id="bodyContent">'+
          '<img src="' + club.image + '" height="200px">' +
          '<p>' + club.description + '</p>' +
          '<a href="' + club.facebook_url + '" target="_blank">Facebook</a><br>' +
          '<a href="https://citymapper.com/directions?endcoord=' + club.lat + ',' + club.lng + '&endname=' + club.name +'" target="_blank">Get There</a>' +
          '</div>'+
          '</div>'
        });
      marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    });
  });
  
}




  //   $.ajax({
  //     dataType: "json",
  //     url: mapperAPI,
  //     data: data,
  //     success: success
  //   });




  //   $.getJSON( mapperAPI, {
  //     tags: "mount rainier",
  //     tagmode: "any",
  //     format: "json"
  //   })
  //     .done(function( data ) {
  //       $.each( data.items, function( i, item ) {
  //         $( "<img>" ).attr( "src", item.media.m ).appendTo( "#images" );
  //         if ( i === 3 ) {
  //           return false;
  //         }
  //       });
  //     });
  // })();




  // var marker = $.getJSON("http://localhost:9000/index.json")
  // .done(function(data){
  //   console.log(data);
  //   $.each(data, function(index, data){
  //     new google.maps.Marker({
  //       position: data.address,
  //       map: map,
  //       title: data.name
  //     });
  //   });
  // });


// google.maps.event.addDomListener(window, 'load', initialize);