$(function(){

  if (localStorage.getItem("access_token") === null) {
    console.log("key does not exist")
    $("#dynamic_ul").append("<li><a class='login_button' href='#'>Login</a></li>")
    $("#dynamic_ul").append("<li><a id='signup_button' href='#'>Signup</a></li>")
  } else {
    console.log("key exists")
    $("#dynamic_ul").append("<li><a id='newbar_link' href='#'>Add Bar</a></li>")
    $("#dynamic_ul").append("<li><a id='logout_link' href='#'>Logout</a></li>")
    var user_id = localStorage.getItem("access_id");
    $.ajax({
      type: "get",
      url: "http://localhost:3000/users/" + user_id,
      dataType: "json",
      beforeSend: function(request){
        checkAccess(request)
      },
    }).done(function(data, response){
      console.log(data);
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
      // console.log(data, response);
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
      // console.log(data, response);
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
      url: "http://localhost:3000/bars",
      data: {
        name: $(".bar_name").val(),
        address: $(".bar_address").val(),
        description: $(".bar_description").val(),
        image: $(".bar_image").val(),
      },
      dataType: "json",
      beforeSend: function(request){
        checkAccess(request)
      },
    }).done(function(data, response) {
      // Add bar using the function from the other file
      // Might be a good idea to namespace later
      // map is now window.map (a little hacky)
      // but not accessible globally
      addBar(data);
    }).error(function(data, response) {
    });
  });

  $("#check").on("click", function(){
      event.preventDefault();
      $.ajax({
        type: "get",
        url: $(this).attr("href"),
        dataType: "json",
        beforeSend: function(request){
          checkAccess(request)
        },
      }).done(function(data, response){
        console.log(data);
      });
    });

  // $("#profile").on("click", function(){
  //   var super_id = localStorage.getItem("access_id");
  //   console.log("is this the id? " + super_id);
  //   event.preventDefault();
  //   $.ajax({
  //     type: "get",
  //     url: "http://localhost:3000/users/" + super_id,
  //     dataType: "json",
  //     beforeSend: function(request){
  //       checkAccess(request)
  //     },
  //   }).done(function(data, response){
  //     console.log(data);
  //   });
  // });

  $("#logout_link").on("click", function(){
    event.preventDefault();
    localStorage.removeItem("access_token");
    $("#map").fadeOut().empty();
    location.reload();
  });

  $("#signup_button").on("click", function(){
    event.preventDefault();
    $("#signup").toggle();
  });

  $("#newbar_link").on("click", function(){
    event.preventDefault();
    $("#newbar").toggle();
  });

  $(".login_button").on("click", function(){
    event.preventDefault();
    $("#login").toggle();
  });
});