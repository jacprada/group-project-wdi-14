$(function(){
  $("form#signup").on("submit", function(){
    event.preventDefault();
    $.ajax({
      type: "post",
      url: $(this).attr("action"),
      data: {
        email: $(".signup_email").val(),
        password: $(".signup_password").val(),
      },
      dataType: "json",
    }).done(function(data, response) {
      // console.log(data, response);
      var access_token = data.token;
      localStorage.setItem("access_token", access_token);
      location.reload();
    });
  });
});