window.addEventListener("DOMContentLoaded", async (event) => {
 

  function removeLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("state");
  }

  removeLocalStorage()
});
