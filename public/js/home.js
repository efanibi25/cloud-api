window.addEventListener("DOMContentLoaded", (event) => {
  let token = localStorage.getItem("token");
  console.log("token: ",token)
  if (!token) {
    alert("You need to login first");
    window.location.href = "http://localhost:8080/login";
  }
});
