const { Datastore } = require("@google-cloud/datastore");
const { format } = require("date-fns");
// Instantiate a datastore client
const datastore = new Datastore();

function checkType(object, type) {
  //special cases
    if (type == "null" && object==null) {
      return true;
    }
  if (type == "array" && Array.isArray(object)) {
    return true;
  }
  if (type == "date") {
    //basic date verification
    try {
      format(new Date(object), "MM/dd/yyyy");
      return true;
    } 
    catch {
      return false;
    }
  }
  //general cases
  if (typeof object === type) {
    return true;
  }

  return false;
}

// .KEY seems to be apart of the DatastoreRequest
// Class

// datastore!: Datastore;
// [key: string]: Entity; ??
async function fromDatastore(list) {
   
    return await Promise.all(list.map(async(e) => {
    e.id = e[Datastore.KEY].id || e[Datastore.KEY].name;
    return e;
  }))

}

async function addSelf(list, kind) {
  return await list.map((e) => {
    e.self = e["self"] = `${global.siteURl}/${kind}/${e["id"]}`;
    return e;
  });
}

function filterByID(list, id) {
  return list.filter((e) => {
    return e["id"] == id;
  });
}

async function getEntitity(kind, id) {
  const query = datastore.createQuery(kind)
  let data = await datastore.runQuery(query);
  data = await fromDatastore(data[0]);
  data = await filterByID(data, id);
  if (data.length == 0) {
    return;
  }
  return data[0];
}



async function getLimitedEntities(kind,pageSize, pageNumber,owner=false) {
  let output = {};
  pageNumber = parseInt(pageNumber);
  let resp = await getPaginatedResults(kind,pageSize, pageNumber,owner);
  let info = resp[1];
  let currData = resp[0];
  let total =resp[2]
  currData = await fromDatastore(currData);
  let val
  //Check Currdata
  switch (currData.length > 0) {
    case true:
      val= currData
      break;
    default:
      val= []
  }
  return [val, info.moreResults !== Datastore.NO_MORE_RESULTS,total]

 
}



async function insert(key, data) {
  let insert = await datastore.save({
    key: key,
    data: data,
  });
  data._id = key.id;
  data._self = key.id;
  return data;
}

async function update(data, id, kind) {
  const key =  datastore.key([kind, parseInt(id)]);
  await datastore.update({
    key: key,
    data: data,
  });
}



async function itemExist(data) {
  if (!data) {
    return false;
  }
  return true;
}

async function keyExist(data, ...rest) {
  if (data == null) {
    return false;
  }
  for (i in rest) {
    let key = rest[i];
    if (data[key] == null) {
      return false;
    }
    data = data[key];
  }
  return true;
}

async function del(kind, id) {
  const key = datastore.key([kind,id]);
  console.log(kind,id)
  await datastore.delete(key);
}

async function getEntities(kind,owner=false) {
  let query=null
  if (owner!=false){
  query = datastore.createQuery(kind).filter("owner", "=", owner);
  }
  else{
    query = datastore.createQuery(kind)

  }
  let data = await datastore.runQuery(query);
  if (data.length == 0) {
    return []
  }
  return await fromDatastore(data[0]);
}



//iternal functions



async function getPrevCursor(kind, pageSize, pageNumber,owner) {
  if(owner!=false){
 let prev = datastore
   .createQuery(kind)
   .filter("owner", "=", owner)
   .limit(pageSize * (pageNumber - 1))
   .select("__key__");
 let prevResults = await datastore.runQuery(prev);
 return prevResults[1].endCursor;
  }
  else{
     let prev = datastore
       .createQuery(kind)
       .limit(pageSize * (pageNumber - 1))
       .select("__key__");
     let prevResults = await datastore.runQuery(prev);
     return prevResults[1].endCursor;
  }
 
}

















async function getPaginatedResults(kind, pageSize, pageNumber,owner) {
  //Gather currdata and next cursor
  let currResults;
  let items = await getEntities(kind, owner);
  let query=null
  //build query
  if(owner!=false){
 query = datastore.createQuery(kind).filter("owner", "=", owner);
  }
  else{
  query = datastore.createQuery(kind);
  }


  if (pageNumber == 1) {
    query = query.limit(pageSize * pageNumber);
    currResults = await datastore.runQuery(query);
    currResults[2] = items.length;
  } else {
    query = query.limit(pageSize)
    query = query.start(await getPrevCursor(kind, pageSize, pageNumber,owner));
    currResults = await datastore.runQuery(query);
    currResults[2] = items.length;
  }
  return currResults;
}
module.exports = {
  checkType,
  getEntitity,
  getLimitedEntities,
  insert,
  update,
  del,
  itemExist,
  keyExist,
  getEntities,
};
