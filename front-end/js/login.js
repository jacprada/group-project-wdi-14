$(function(){
  getWeather();

  if (localStorage.getItem("access_token") === null) {
      $("#dynamic_ul").append("<li><a href='#' data-reveal-id='login_div' data-reveal>Login</a></li>")
      $("#dynamic_ul").append("<li><a id='signup_button' href='#' data-reveal-id='signup_div' data-reveal>Sign Up</a></li>")
      $("#user_ul").prepend("<li id='weather_id'><a id='weather'>London</a></li>")
      $(".welcome-info").show();
    } else {
      $("#dynamic_ul").append("<li><a id='newbar_link' href='#' data-reveal-id='newbar_div' data-reveal>Add Bar</a></li>")
      $("#dynamic_ul").append("<li><a id='logout_link' href='#'>Logout</a></li>")
      $("#user_ul").prepend("<li id='weather_id'><a id='weather'>London</a></li>")
      $("#logo-small").show();
      var user_id = localStorage.getItem("access_id");
      $.ajax({
        type: "get",
        url: "https://floating-sea-7710.herokuapp.com/users/" + user_id,
        dataType: "json",
        beforeSend: function(request){
          checkAccess(request)
        },
      }).done(function(data, response){
        $("#user_ul").append("<li class='active'><a id='profile_nav'>Hello, " + data.firstName + "</a></li>")
      });
    }

  $("form#login").on("submit", function(){
    event.preventDefault();
    $.ajax({
      type: "post",
      url: $(this).attr("action"),
      data: {
        email: $(".email").val(),
        password: $(".password").val(),
      },
      dataType: "json",
    }).done(function(data, response) {
      console.log(data)
      var user_id = data.user._id
      var access_token = data.token;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("access_id", user_id);
      location.reload();
    });
  });

  $("form#signup").on("submit", function(){
    event.preventDefault();
    $.ajax({
      type: "post",
      url: $(this).attr("action"),
      data: {
        email: $(".signup_email").val(),
        password: $(".signup_password").val(),
        firstName: $(".signup_firstName").val(),
        lastName: $(".signup_lastName").val(),
      },
      dataType: "json",
    }).done(function(data, response) {
      console.log(data)
      var user_id = data.user._id
      var access_token = data.token;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("access_id", user_id);
      location.reload();
    });
  });

  $("form#newbar").on("submit", function(){
    event.preventDefault();
    $.ajax({
      type: "post",
      url: "https://floating-sea-7710.herokuapp.com/bars",
      data: {
        name: $(".bar_name").val(),
        address: $(".bar_address").val(),
        description: $(".bar_description").val(),
        image: $(".bar_image").val()
      },
      dataType: "json",
      beforeSend: function(request){
        checkAccess(request)
      },
    }).done(function(data, response) {
      // Add bar using the function from the other file
      addBar(data);
      $("#newbar_div .close-reveal-modal").trigger("click");
      $("form#newbar input[type=text]").val("");
    }).error(function(data, response) {
    });
  });

  $("#logout_link").on("click", function(){
    event.preventDefault();
    localStorage.removeItem("access_token");
    $("#map").fadeOut().empty();
    location.reload();
  });

});

function getWeather(){
  event.preventDefault();

  $.ajax({
    type:'get',
    url: "http://api.wunderground.com/api/429345ead5d273da/conditions/forecast/q/England/London.json"
  }).done(function(data) {
    addWeather(data);
  });
}

// ADD WEATHER TO THE PAGE IN LIST FORM

function addWeather(location){
  var dt = new Date();
  var time = dt.getHours() + ":" + dt.getMinutes();
  $("#weather").append(" | " + time + " | " + location.current_observation.temp_c + "&deg;C");
}