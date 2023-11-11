const general = require("../util/dataStore.js");
class users {
  constructor(first,last,email) {
    this.first = first;
    this.last = last;
    this.email = email;
  }
  validate() {
    return (
      [
        general.checkType(this.first, "string"),
        general.checkType(this.last, "string"),
        general.checkType(this.email, "string"),
      ].includes(false) == false
    );
  }
  static convertDataStore(boat) {
    let newBoat = new boats(
      boat["name"],
      boat["type"],
      boat["length"],
      boat["loads"]
    );
    return newBoat;
  }
  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  getLength() {
    return this.length;
  }
  removeLoad(load) {
    this.loads = this.loads.filter((e) => e["id"] != load["id"]);
  }

  addLoad(load) {
    let ele = {
      id: load["id"],
      self: load["self"],
    };
    this.loads=this.loads || []
    this.loads.push(ele);
  }

  set _id(id) {
    this.id = id;
  }

  set _self(key) {
    this.self = `${global.siteURl}/boats/${key}`;
  }
}
module.exports = { users };
