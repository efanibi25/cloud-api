const express = require("express");
const router = express.Router();
const controller = require("../controllers/boats.js");
var google = require("../util/google.js");


//read
router.get(
  "/",
  controller.getBoats
);
router.get(
  "/page/:page_number",
  controller.getBoats
);


router.get(
  "/page/",
  controller.getBoats
);

router.get("/:boat_id", controller.getBoat);

router.get("/:boat_id/loads", controller.getLoads);

//create
router.post(
  "/",
  controller.addBoat
);


//delete
router.delete("/all", controller.delBoats);
router.delete(
  "/:boat_id",
  controller.delBoat
);

//update

router.put(
  "/:boat_id/loads/:load_id",
  controller.addLoad2Boat
);
router.delete("/:boat_id/loads/:load_id", controller.removeLoadFromBoat);
router.patch("/:boat_id",controller.updateBoatParam);
router.put("/:boat_id", controller.updateBoatParams);











module.exports = router;
