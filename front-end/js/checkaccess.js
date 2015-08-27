function checkAccess(request){
  var access_token = localStorage.getItem("access_token");
  if (access_token) {
    // console.log(access_token)
    return request.setRequestHeader("x-access-token", access_token);
  }
}