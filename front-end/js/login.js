$(function(){

  if (localStorage.getItem("access_token") === null) {
    console.log("key does not exist")
    $("#dynamic_ul").append("<li><a id='login_button' href='#'>Login</a></li>")
    $("#dynamic_ul").append("<li><a id='signup_button' href='#'>Signup</a></li>")
  } else {
    console.log("key exists")
    $("#dynamic_ul").append("<li><a id='check' href='http://localhost:3000/bars'>Bars</a></li>")
    $("#dynamic_ul").append("<li><a id='profile' href='#'>Profile</a></li>")
    $("#dynamic_ul").append("<li><a id='logout_link' href='#'>Logout</a></li>")
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
        password: $(".signup_firstName").val(),
        password: $(".signup_lastName").val(),
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

  $("#profile").on("click", function(){
    var super_id = localStorage.getItem("access_id");
    console.log("is this the id? " + super_id);
    event.preventDefault();
    $.ajax({
      type: "get",
      url: "http://localhost:3000/users/" + super_id,
      dataType: "json",
      beforeSend: function(request){
        checkAccess(request)
      },
    }).done(function(data, response){
      console.log(data);
    });
  });



  $("#logout_link").on("click", function(){
    event.preventDefault();
    localStorage.removeItem("access_token");
    $("#map").fadeOut().empty();
    location.reload();
  })

  $("#signup_button").on("click", function(){
    event.preventDefault();
    $("#signup").toggle();
  });

  $("#login_button").on("click", function(){
    event.preventDefault();
    $("#login").toggle();
  });
});