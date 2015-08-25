function checkAccess(request){
  if (localStorage.getItem("access_token")) {
    return request.setRequestHeader("x-access-token", localStorage.getItem("access_token"));
  }
}