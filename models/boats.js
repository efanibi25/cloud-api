const general = require("../util/dataStore.js");
class boats {
  constructor(name, type, length,owner, loads=[]) {
    this.name = name;
    this.type = type;
    this.length = length;
    this.owner = owner;
    this.loads = loads;

  }
  validate() {
    return (
      [
        general.checkType(this.name, "string"),
        general.checkType(this.type, "string"),
        general.checkType(this.length, "number"),
        general.checkType(this.loads, "array") 
      ].includes(false) == false
    );
  }
  static convertDataStore(boat) {
    let newBoat = new boats(
      boat["name"],
      boat["type"],
      boat["length"],
      boat["owner"],
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
    let bools=this.loads.map((e)=>{
      return e["id"]!=load["id"]
    })
    if(!bools.includes(false)){
      this.loads.push(ele)
    }

  }

  set _id(id) {
    this.id = id;
  }

  set _self(key) {
    this.self = `${global.siteURl}/boats/${key}`;
  }
}
module.exports = { boats };
