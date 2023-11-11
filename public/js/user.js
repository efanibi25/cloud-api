window.addEventListener("DOMContentLoaded", async (event) => {
  function verifyToken() {
    let token = localStorage.getItem("token");

    if (!token) {
      alert("You need to login first");
      window.location.href = "http://localhost:8080/login";
    }
  }
  function removeLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("state");
  }

  function verifyNames(data) {
    if (data == null) {
      return false;
    }
    if (data["names"].length == 0) {
      return false;
    }
    return true;
  }

  function addStateNode() {
    let state = localStorage.getItem("state");

    list = document.getElementById("data");
    let Node = document.createElement("h3");
    Node.textContent = `State: ${state}`;
    list.appendChild(Node);
  }

  function addFirstNameNode(data) {
    let name = "Unknown";
    if (verifyNames(data)) {
      name = data["names"][0]["givenName"];
    }
    list = document.getElementById("data");
    let Node = document.createElement("h3");
    Node.textContent = `First Name: ${name}`;
    list.appendChild(Node);
  }

  function addLastNameNode(data) {
    let name = "Unknown";
    if (verifyNames(data)) {
      name = data["names"][0]["familyName"];
    }
    list = document.getElementById("data");
    let Node = document.createElement("h3");
    Node.textContent = `Last Name: ${name}`;
    list.appendChild(Node);
  }

  async function getUserData() {
    let token = localStorage.getItem("token");
    let url = "http://localhost:8080/userData";
    let resp = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let data = await resp.json();
    if (data["error"]) {
      removeLocalStorage();
      alert("Authorize Again");
      location.href = "http://localhost:8080";
    }
    return data;
  }
  verifyToken();
  addStateNode();
  let data = await getUserData();
  addFirstNameNode(data);
  addLastNameNode(data);
});
