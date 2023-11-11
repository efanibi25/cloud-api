window.addEventListener("DOMContentLoaded", async (event) => {
  function getState() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("state");
  }

  function removeLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("state");
  }

  async function getToken() {
    let url = `http://localhost:8080/token${window.location.search}`;
    let resp = await fetch(url);
    let data = await resp.json();
    console.log(data);
    if (data["error"]) {
      alert("Need to auth again");
      return false;
    } else {
      localStorage.setItem("token", [data["token"]]);
      return true;
    }
  }

  async function verifyState() {
    let state = getState();
    let url = `http://localhost:8080/verify?state=${state}`;
    let resp = await fetch(url);
    let data = await resp.json();
    if (data["verified"] == false) {
      alert("could not verify state");
      return false;
    } else {
      localStorage.setItem("state", state);
      return true;
    }
  }

  if ((await verifyState()) && (await getToken())) {
    console.log("add user")
    location.href = "http://localhost:8080";
  } else {
    removeLocalStorage();
    location.href = "http://localhost:8080/login";
  }
});
