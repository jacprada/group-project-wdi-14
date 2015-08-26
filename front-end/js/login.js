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
      userData = data.user
      console.log("Hello " + userData.firstName)
      var access_token = data.token;
      localStorage.setItem("access_token", access_token);
      location.reload();
    });
  });

  $("#about_button").on("click", function(){
    event.preventDefault();
    $("#login").toggle();
  });

  $(".logout").on("click", function(){
    event.preventDefault();
    localStorage.removeItem("access_token");
    $("#map").fadeOut().empty();
  })
});