const express = require("express");
const dose_controller = require("../controllers/dose_controller.js");
const auth_controller = require("../controllers/auth_controller.js");
const router = express.Router();

router.use(auth_controller.protect);

router.post("/add_dosage", dose_controller.addDosage);
router.get("/all_dosages", dose_controller.getAllDosages);
router.get("/dosage/:id", dose_controller.getDosageById);
router.get("/dosages", dose_controller.getDosageOfLogedIn);
router.patch("/update_dosage/:id", dose_controller.updateDosage);
router.delete("/delete_dosage/:id", dose_controller.deleteDosage);
router.patch("/mark_dosage_slot", dose_controller.markDosageSlot);

module.exports = router;
