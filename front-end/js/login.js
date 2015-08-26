$(function(){
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
      var access_token = data.token;
      localStorage.setItem("access_token", access_token);
      location.reload();
    });
  });

  $(".check").on("click", function(){
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

  $("#about_button").on("click", function(){
    event.preventDefault();
    $.ajax({
      type: "get",
      url: "http://localhost:3000/loginformz",
      dataType: "json",
      beforeSend: function(request){
        checkAccess(request)
      },
    }).done(function(data, response){
      console.log(data);
    });
  });


  // $("#about_button").on("click", function(){
  //   event.preventDefault();
  //   $("#login_form").load("login_form.html");
  // });




  // $("#about_button").on("click", function(){
  //   event.preventDefault();
  //   $("#login_form").toogle();
  // }

  // $("#about_button").on("click", function(request){
  //   event.preventDefault();
  //   if checkAccess(request) {
  //     $("#login_form").toggle();
  //   }
  // });

  // $( document ).click(function() {
  //   $( "div" ).effect( "bounce", "slow" );
  // });

  // $("#about_button").on("click", function(){
  //   event.preventDefault();
  //   $("body").prepend("<h1>Hello Mama</h1>");
  // });

  $(".logout").on("click", function(){
    event.preventDefault();
    localStorage.removeItem("access_token");
    $("#map").fadeOut().empty();
  })
});