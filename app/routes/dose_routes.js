const express = require("express");
const dose_controller = require("../controllers/dose_controller.js");
const router = express.Router();

router.post("/add_dosage", dose_controller.addDosage);
router.get("/all_dosages", dose_controller.getAllDosages);
router.get("/dosage/:id", dose_controller.getDosageById);
router.put("/update_dosage/:id", dose_controller.updateDosage);
router.delete("/delete_dosage/:id", dose_controller.deleteDosage);

module.exports = router;
