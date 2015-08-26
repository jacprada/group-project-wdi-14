$(function(){

  if (localStorage.getItem("access_token") === null) {
    console.log("key does not exist")
    $("#dynamic_ul").append("<li><a id='login_button' href='#'>Login</a></li>")
    $("#dynamic_ul").append("<li><a id='signup_button' href='#'>Signup</a></li>")
  } else {
    console.log("key exists")
    $("#dynamic_ul").append("<li><a id='check' href='http://localhost:3000/bars'>Bars</a></li>")
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
      userData = data.user
      // console.log(userData)
      // console.log("Hello " + userData.firstName)
      var access_token = data.token;
      localStorage.setItem("access_token", access_token);
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