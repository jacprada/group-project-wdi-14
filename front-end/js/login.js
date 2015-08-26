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
    $("#map").prepend("<h1>Hello Mama</h1>");
  });

  $(".logout").on("click", function(){
    event.preventDefault();
    localStorage.removeItem("access_token");
    $("#map").fadeOut().empty();
  })
});