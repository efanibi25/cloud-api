// const editBoat = async (req, res) => {
//   const query = datastore.createQuery(kind);
//   let data = await datastore.runQuery(query);
//   data=general.fromDatastore(data[0])
//   data=general.filterByID(data,req.params.boat_id);
//   if (data.length == 0) {
//     res.status(404).send({
//       "Error": "No boat with this boat_id exists",
//     });
//   return
//   }
//    let boat = new boats.boats(
//     req.body["name"],
//     req.body["type"],
//     req.body["length"]
//   );
//   if(boat.validate()){
//  const key = datastore.key([kind, parseInt(req.params.boat_id,10)])
// datastore.update({
//   key: key,
//   data: boat,
// });
// boat["id"] = key.id;
// res.send(boat)
//   }
//   else{
//      res.status(400).send({
//       "Error": "Missing Parameters",
//     });
//   }
// };

// const deleteBoat = async (req, res) => {
//   const query = datastore.createQuery(kind);
//   let data = await datastore.runQuery(query);
//   data = general.fromDatastore(data[0]);
//   data = general.filterByID(data, req.params.boat_id);
//   if (data.length == 0) {
//     res.status(404).send({
//       Error: "No boat with this boat_id exists",
//     });
//   }

//   else {
//   const key = datastore.key([kind, parseInt(req.params.boat_id, 10)]);
//    datastore.delete(key);

//   res.status(204).send()
//   }

// };

// const addLoad = (req, res, err) => {
//   const key = datastore.key(kind);
//   let slip = new loads.loads(
//     req.body["number"],
//   );
//   if (slip.validate()) {
//     datastore.save({
//       key: key,
//       data: slip,
//     });
//      console.log(key);
//      return;

//     slip["id"]=key.id
//     .log(slip)
//     // res.status(201).send(slip);
//   } else {
//     res
//       .status(400)
//       .send({
//         Error:
//           "The request object is missing at least one of the required attributes",
//       });
//   }
// };

// const getLoads = async (req, res) => {
//    res.send(await general.getEntitity(kind));
// };

// const getLoads = async (req, res) => {
//      data = await general.getEntitity(kind, req.params.slip_id);
//   if (data.length==0 || data[0].length == 0) {
//     res.status(404).send({
//       Error: "No slip with this slip_id exists",
//     });
//   } else {
//     res.send(data[0]);
//   }
// };

// //Modifications needed to use this via import
// const getBoat = async (req, res) => {
//   const query = datastore.createQuery("boats");
//   let data = await datastore.runQuery(query);
//   data = general.fromDatastore(data[0]);
//   data = general.filterByID(data, req.params.boat_id);

//   if (data.length == 0 || data[0].length == 0) {
//     return false
//   } else {
//     return true
//   }
// };

// const editLoads = async (req, res) => {
//   const query = datastore.createQuery(kind);
//   let data = await datastore.runQuery(query);
//   data = general.fromDatastore(data[0]);
//   data = general.filterByID(data, req.params.slip_id);
//   console.log(data, data.boat_id != null);
//   let boatData = await general.getEntitityList(
//     "boats",
//     req.params.boat_id
//   );

//       if (data.length == 0||boatData.length==0) {
//     res.status(404).send({
//       Error: "The specified boat and/or slip does not exist ",
//     });
//   }
//    else if(data[0].boat_id!=null) {
//      res.status(403).send({
//        Error: "The slip is not empty because there is already a boat at this slip",
//      });
//    }

//   else {
//      const key = datastore.key([kind, parseInt(req.params.slip_id, 10)]);
//       let slip = new loads.loads(req.params["slip_id"], req.params["boat_id"]);
//       datastore.update({
//       key: key,
//       data: slip,
//     });
//      slip["id"] = key.id;
//     res.send(slip);
//   }
// };

// const deleteLoads = async (req, res) => {
//   const query = datastore.createQuery(kind);
//   let data = await datastore.runQuery(query);
//   data = general.fromDatastore(data[0]);
//   data = general.filterByID(data, req.params.slip_id);
//   if (data.length == 0) {
//     res.status(404).send({
//       Error: "No boat with this slip_id exists",
//     });
//   } else {
//     const key = datastore.key([kind, parseInt(req.params.slip_id, 10)]);
//     datastore.delete(key);
//     res.status(204).send();
//   }
// };
