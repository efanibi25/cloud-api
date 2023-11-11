const { Datastore } = require("@google-cloud/datastore");
const loads = require("../models/loads.js");
const boats = require("../models/boats.js");
const general = require("../util/dataStore.js");
const errors = require("../errors/errorPicker.js");

const datastore = new Datastore();
const axios = require("axios").default;


const kind = "loads";
const pageSize = 5;


//any one can add a load, no owner ID needed
const addLoad = async (req, res, next) => {
   if (req.header("accept") != "application/json") {
     errors.errors(res, next, "invalidAcceptHeader");
     return false;
   }
  let load = new loads.loads(
    req.body.volume,
    req.body.item,
    req.body.creation_date
  );
  if (load.validate()) {
  await general.insert(datastore.key(kind), load);
  delete load.owner
  res.status(201).send(load);
  return
  }
  errors.errors(res, next, "invalidParams");
};

//Hide loads tied to a owner
const getLoads = async (req, res) => {
     if (req.header("accept") != "application/json") {
       errors.errors(res, next, "invalidAcceptHeader");
       return false;
     }
  console.log(await getID(req.headers.authorization));
  let pageNumber = req.params.page_number || 1;
  let resp = await general.getLimitedEntities(
    kind,
    pageSize,
    pageNumber,
    await getID(req.headers.authorization)
  );
let arr = resp[0];
let more = resp[1];
let total = resp[2];
  let vals=await Promise.all(await arr.map((e)=>{
    let load=loads.loads.convertDataStore(e)
    load._id=e["id"]
     load._self = e["id"];
     delete load.owner
     return load
  }))
    let dict = { count: total, loads: vals };
    if (more) {
      dict["next"] = `${siteURl}/${kind}/page/${parseInt(pageNumber) + 1}`;
    }
    res.send(dict);
}


const getLoad = async (req, res, next) => {
     if (req.header("accept") != "application/json") {
       errors.errors(res, next, "invalidAcceptHeader");
       return false;
     }
  let load = await general.getEntitity(kind, req.params.load_id);
  if (load && checkOwner(load, req)) {
    load = loads.loads.convertDataStore(load);
    load._id = req.params.load_id;
    load._self = req.params.load_id;
    delete load.owner
    res.send(load);
  } else {
    errors.errors(res, next, "accessDeniedLoad");
  }
};

const delLoad = async (req, res, next) => {
  let load = await general.getEntitity("loads", req.params.load_id);
  

  if (load == null) {
    errors.errors(res, next, "accessDeniedLoad");
    return
  }
  else if(load["owner"]!=null &&await checkOwner(load,req)==false){
     errors.errors(res, next, "accessDeniedLoad");
     return;
  }
  if (load["carrier"]!=null){
    let boatid = load["carrier"]["id"];
     let boat = await general.getEntitity("boats", boatid);
     boat = boats.boats.convertDataStore(boat);
     await boat.removeLoad(load);
     await general.update(boat, boatid, "boats");
  }
  general.del(kind, req.params.load_id);
  res.status("204").send("");

}


async function updateLoadParam(req, res, next) {
  let load = await general.getEntitity(kind, req.params.load_id);
    if (!load) {
      errors.errors(res, next, "accessDeniedLoad");
      return false;
    }
    if (load["owner"] != null && !checkOwner(load, req)) {
      errors.errors(res, next, "accessDeniedLoad");
      return false;
    }

  if (Object.keys(req.body).length > 1) {
    errors.errors(res, next, "tooManyParams");
    return false;
  }

  if (
    Object.keys(req.body).includes("carrier") ||
    Object.keys(req.body).includes("owner")
  ) {
    errors.errors(res, next, "restrictedParamsLoads");
    return false;
  }

  load = loads.loads.convertDataStore(load);
  load["volume"] = req.body.volume || load["volume"];
  load["item"] = req.body.item || load["item"];
  load["creation_date"] = req.body.creation_date || load["creation_date"];

  if (!load.validate()) {
   errors.errors(res, next, "invalidParams");
   return false;
  }
  general.update(load, req.params.load_id, kind);
  delete load.owner
  res.send(load);
}

async function updateLoadParams(req, res, next) {
  let load = await general.getEntitity(kind, req.params.load_id);
  if (!load) {
    errors.errors(res, next, "accessDeniedLoad");
    return false;
  }
  if(load["owner"]!=null && !checkOwner(load, req)){
     errors.errors(res, next, "accessDeniedLoad");
    return false;
  }
  if (
    Object.keys(req.body).includes("owner"),
    Object.keys(req.body).includes("carrier")
  ) {
    errors.errors(res, next, "restrictedParamsLoads");
    return false;
  }

  let newLoad = new loads.loads(
    req.body.volume,
    req.body.item,
    req.body.creation_date,
  );
  if (!newLoad.validate()) {
     errors.errors(res, next, "invalidParams");
     return false;
  }
  newLoad.owner=load["owner"] 
  general.update(newLoad, req.params.load_id, kind);

  res.send(newLoad);
}

async function checkOwner(item, req) {
  let id = await getID(req.headers.authorization);
  if (item["owner"] == id) {
    return true;
  }
  return false;
}

//delete all loads for testing
const delLoads = async (req, res) => {
 let loads = await general.getEntities(kind)
 await Promise.all(loads.map(async(e)=>{
   await general.del(kind,parseInt(e["id"]))
 }))
 res.send("deleted")
};


async function getID(token) {

  if (token) {
    let config = {
      headers: {
        authorization: token,
      },
    };
    
    try {
      let resp = await axios.get("http://localhost:8080/confirm", config);
      return resp.data["id"];
    } catch (err) {
      return "error";
    }
  }
  return null;
}

async function checkOwner(load, req) {
  let id = await getID(req.headers.authorization);
  if (load["owner"] == id) {
    return true;
  }
  return false;
}


module.exports = { delLoads,addLoad, getLoad, getLoads, delLoad,updateLoadParam,updateLoadParams }
