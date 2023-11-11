const express = require("express");
const router = express.Router();
const controller = require("../controllers/loads.js");

router.get("/", controller.getLoads);
router.get("/page/:page_number", controller.getLoads);
router.get("/page/", controller.getLoads);
router.get("/:load_id", controller.getLoad);
router.post("/", controller.addLoad);
router.delete("/all", controller.delLoads);
router.delete("/:load_id", controller.delLoad);
router.put("/:load_id", controller.updateLoadParams);
router.patch("/:load_id", controller.updateLoadParam);

module.exports = router;
