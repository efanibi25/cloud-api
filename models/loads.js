const general = require("../util/dataStore.js");
class loads {
  constructor(volume, item, creation, carrier = null) {
    this.volume = volume;
    this.item = item;
    this.creation_date = creation;
    this.owner = null;
    this.carrier = carrier;
  }
  validate() {
    return (
      [
        general.checkType(this.volume, "number"),
        general.checkType(this.item, "string"),
        general.checkType(this.creation_date, "date"),
        general.checkType(this.carrier, "object") ||
          general.checkType(this.carrier, "null"),
      ].includes(false) == false
    );
  }

  static convertDataStore(load) {
    let newLoad = new loads(
      load["volume"],
      load["item"],
      load["creation_date"],
      load["carrier"]
    );
    return newLoad;
  }

  set _id(id) {
    this.id = id;
  }

  set _self(key) {
    this.self = `${global.siteURl}/loads/${key}`;
  }

  set _owner(owner) {
    this.owner = owner
  }

  addCarrier(carrier) {
    this.carrier = {
      id: carrier["id"],
      name: carrier["name"],
      self: carrier["self"],
    };
  }

  removeCarrier() {
    this.carrier = null;
    this.owner = null;
  }
}
module.exports = { loads };
