const { Datastore } = require("@google-cloud/datastore");
const { id } = require("date-fns/locale");
const { google } = require("googleapis");
const boats = require("../models/boats.js");
const loads = require("../models/loads.js");
const general = require("../util/dataStore.js");
const errors = require("../errors/errorPicker.js");

const axios = require("axios").default;


// Instantiate a datastore client
const datastore = new Datastore();

/*
Constant Values
*/
const kind = "boats";
const pageSize = 5;

/*
Main Functions
*/

// In addition to a kind, each entity has an identifier, assigned when the entity is
//  created. Because it is part of the entity's key, the identifier is associated
//  permanently with the entity and cannot be changed. It can be assigned in
//  either of two ways:

// Your application can specify its own key name string for the entity.

// You can have Firestore in Datastore mode automatically assign the entity an
// integer numeric ID.

// Note the cloud store doesn't say this but it should probably be assume the
// key name needs to be unique

const addBoat = async (req, res, next) => {
     if (req.header("accept") != "application/json") {
       errors.errors(res, next, "invalidAcceptHeader");
       return false;
     }
  let ownerid = await getID(req.headers.authorization);
  if(ownerid=="error"){
  errors.errors(res, next, "expiredToken");
  return
  }
  let boat = new boats.boats(
    req.body["name"],
    req.body["type"],
    req.body["length"],
    ownerid
  );
  if (boat.validate()) {
    res.status(201).send(await general.insert(datastore.key(kind), boat));
  } else {
    errors.errors(res, next, "invalidParams");
  }
};

// https://cloud.google.com/datastore/docs/concepts/queries
// Since we have complete key, via save we need to run queries


// we can either use
// /boats
// /boats/page/
// /boats/page/1
const getBoats = async (req, res,next) => {
         if (req.header("accept") != "application/json") {
           errors.errors(res, next, "invalidAcceptHeader");
           return false;
         }
  let pageNumber = req.params.page_number || 1;
    let resp = await general.getLimitedEntities(
      kind,
      pageSize,
      pageNumber,
      await getID(req.headers.authorization)
    );
    let arr = resp[0];
    let more = resp[1];
    let total = resp[2]
    let vals = await Promise.all(
      await arr.map((e) => {
        let boat = boats.boats.convertDataStore(e);
        boat._id = e["id"];
        boat._self = e["id"];
        return boat;
      })
    )
    let dict={count:total,boats:vals}
    if (more) {
      dict["next"]= `${siteURl}/${kind}/page/${parseInt(pageNumber) + 1}` 
    }
    res.send(dict)
};

//get null boat anytime
//get owner boats only with proper key
const getBoat = async (req, res, next) => {
       if (req.header("accept") != "application/json") {
         errors.errors(res, next, "invalidAcceptHeader");
         return false;
       }
  let boat = await general.getEntitity(kind, req.params.boat_id);
  if(boat && await checkOwner(boat, req)){
    boat = boats.boats.convertDataStore(boat);
    boat._id = req.params.boat_id;
    boat._self = req.params.boat_id;
    res.send(boat);
  }
   else {
    errors.errors(res, next, "accessDeniedBoat");
  }


}

//check if loads are actually untied
const delBoat = async (req, res, next) => {
  let boat = await general.getEntitity(kind, req.params.boat_id);
  if (!boat || await checkOwner(boat, req) == false) {
      errors.errors(res, next, "accessDeniedBoat");
  } 

  else {
    untieLoads(boat["loads"]);
    await general.del(kind, parseInt(req.params.boat_id));
    res.status("204").send("");

  }
};

const addLoad2Boat = async (req, res, next) => {
  let boat = await general.getEntitity("boats", req.params.boat_id);
  let load = await general.getEntitity("loads", req.params.load_id);
  if (
    (await checkBoatLoadExistance(boat, load, res, next)) == true &&
    (await checkBoatLoadingStatus(boat, load, req, res, next)) == true &&
    (await checkOwner(boat, req)) == true &&
    (load["owner"]==null ||await checkOwner(load, req)) == true
  ) {
    
    boat = boats.boats.convertDataStore(boat);
    boat._id = req.params.boat_id;
    boat._self = req.params.boat_id;

    load = loads.loads.convertDataStore(load);
    load._id = req.params.load_id;
    load._self = req.params.load_id;
    boat.addLoad(load);
    load.addCarrier(boat);
    //update owner info
    load.owner = boat["owner"];
    console.log(load);
    await general.update(boat, req.params.boat_id, "boats");
    await general.update(load, req.params.load_id, "loads");
    res.status(204).send("");
  } else {
    res.status("405").send("error with adding load to boat");
  }
};

const removeLoadFromBoat = async (req, res, next) => {
  let boat = await general.getEntitity("boats", req.params.boat_id);
  let load = await general.getEntitity("loads", req.params.load_id);

  let id = await getID(req.headers.authorization);
  if (id == "error") {
    errors.errors(res, next, "expiredToken");
    return;
  }


  else if (
    (await checkBoatLoadExistance(boat, load, req, res, next)) &&
    (await checkOwner(boat, req)) == true &&
    (await checkOwner(load, req)) == true 
    &&
    (await checkBoatUnLoadingStatus(boat, load, res, next))
  ) {
 
    boat = boats.boats.convertDataStore(boat);
    boat._self = req.params.boat_id;
    boat._id = req.params.boat_id;

    load = loads.loads.convertDataStore(load);
    load._self = req.params.load_id;
    load._id = req.params.load_id;

    await boat.removeLoad(load);
    await load.removeCarrier();
    //remove owner
    load.owner = null;
    await general.update(boat, req.params.boat_id, "boats");
    await general.update(load, req.params.load_id, "loads");
    res.status(204).send("");
  } else {
    res.status("500").send({ error: "unable to remove load" });
  } 
};

const getLoads = async (req, res, next) => {

   if (req.header("accept") != "application/json") {
     errors.errors(res, next, "invalidAcceptHeader");
     return false;
   }
  let boat = await general.getEntitity(kind, req.params.boat_id);
  if (boat && checkOwner(boat,req)) 
  {
    res.send({"loads":await Promise.all(boat["loads"].map(async(e)=>{
     let entitiy=await general.getEntitity("loads",e["id"])
     return loads.loads.convertDataStore(entitiy)
    }))})
  } 
  else{
     errors.errors(res, next, "accessDeniedBoat")
     return
  }
   
  }

  async function updateBoatParam(req, res, next) {
     if (req.header("accept") != "application/json") {
       errors.errors(res, next, "invalidAcceptHeader");
       return false;
     }
  let boat = await general.getEntitity(kind, req.params.boat_id);
  let id = await getID(req.headers.authorization);
  if (id == "error") {
        errors.errors(res, next, "expiredToken");
        return;
  }
    
  if (!boat || (await checkOwner(boat, req)) == false) {
       errors.errors(res, next, "accessDeniedBoat");
       return;
  }

  if(Object.keys(req.body).length>1){
    errors.errors(res, next, "tooManyParams");
    return;
  }

  if (Object.keys(req.body).includes("loads")||Object.keys(req.body).includes("owner")) {
    errors.errors(res, next, "restrictedParamsBoats");
    return;
  }
  boat = boats.boats.convertDataStore(boat);
  boat["name"] = req.body.name || boat["name"];
  boat["type"] = req.body.type || boat["type"];
  boat["length"] = req.body.length || boat["length"];

  if (!boat.validate()) {
     errors.errors(res, next, "invalidParams");
     return;
  }
    general.update(boat,req.params.boat_id,"boats");
    boat._id = req.params.boat_id;
    boat._self = req.params.boat_id;
    res.send(boat)
}


  async function updateBoatParams(req, res, next) {
       if (req.header("accept") != "application/json") {
         errors.errors(res, next, "invalidAcceptHeader");
         return false;
       }
    let boat = await general.getEntitity(kind, req.params.boat_id);
    if (req.headers.authorization){
      let id=await getID(req.headers.authorization);
      if(id=="error"){
        errors.errors(res, next, "expiredToken");
        return
      }

    }
    if (!boat || (await checkOwner(boat, req)) == false) {
        errors.errors(res, next, "accessDeniedBoat");
        return;
      }
    if(Object.keys(req.body).includes("loads")||Object.keys(req.body).includes("owner")){
        errors.errors(res, next, "restrictedParamsBoats");
        return;
    }
     let newBoat = new boats.boats(
       req.body["name"],
       req.body["type"],
       req.body["length"],
       boat["owner"]
     );
    if (!newBoat.validate()) {
      errors.errors(res, next, "invalidParams");
      return
    }
    await general.update(newBoat,req.params.boat_id,kind)
    newBoat._id=req.params.boat_id
     newBoat._self = req.params.boat_id;
    res.send(newBoat);
  }


/*
Helper Functions
*/

async function untieLoads(loadlist) {
  //stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  //async functions return a promise which is returned by each iterable of map this is why this works but foreach doesn't which has no return
  await Promise.all(
    loadlist.map(async (e) => {
      let load = await general.getEntitity("loads", e["id"]);
      load = loads.loads.convertDataStore(load);
      await load.removeCarrier();
      //remove owner
      load.owner = null;
      await general.update(load, e["id"], "loads");
    })
  );
}

async function checkBoatLoadExistance(boat,load,res, next){
  console.log(boat)
  console.log(load)
  if (boat == null ||load == null) {
       errors.errors(res, next, "accessDeniedItem");
      return false;
  } 
 else {
     return true;
   }
}





async function checkBoatLoadingStatus(boat, load, req,res, next) {
  if (load["carrier"]==null){
    return true
  }
  else if(load["carrier"]!=null&&load["carrier"]["id"]==boat["id"]){
    return true
  }
  else{
 return false
  }

 
}
  
 

async function checkBoatUnLoadingStatus(boat, load,res, next) { 
   if (
    boat["loads"].map((e) => e["id"]).includes(load["id"]) == false
  ) {

       errors.errors(res, next, "loadNotTied");
       return false
  }
  return true;
}

async function getID(token){
     if (token) {
       let config = {
         headers: {
           authorization: token,
         },
       };
       try {
         let resp = await axios.get("http://localhost:8080/confirm", config);
         return resp.data["id"]
       } catch (err) {
        return "error"
       }
     }
      return null;
}


async function checkOwner(item, req) {
  let id = await getID(req.headers.authorization);
  console.log(item)
  if (item["owner"] == id) {
    return true;
  }
  return false;
}

//delete all boats for testing
const delBoats = async (req, res) => {
 let boats = await general.getEntities(kind)
 await Promise.all(boats.map(async(e)=>{
   console.log(e["id"])
   await general.del(kind,parseInt(e["id"]))

 }))
 res.send("deleted")
};


module.exports = {
  addBoat,
  getBoats,
  getBoat,
  addLoad2Boat,
  removeLoadFromBoat,
  getLoads,
  delBoat,
  updateBoatParam,
  updateBoatParams,
  delBoats
};
