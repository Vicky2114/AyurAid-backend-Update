const express = require("express");
const dose_controller = require("../controllers/dose_controller.js");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJwt.js");

<<<<<<< HEAD
router.post("/add_dosage", authenticateJWT, dose_controller.addDosage);
router.get("/all_dosages", authenticateJWT, dose_controller.getAllDosages);
router.get("/dosage/:id", authenticateJWT, dose_controller.getDosageById);
router.put("/update_dosage/:id", authenticateJWT, dose_controller.updateDosage);
router.delete(
  "/delete_dosage/:id",
  authenticateJWT,
  dose_controller.deleteDosage
);

router.put(
  "/mark_dosage_slot",
  authenticateJWT,
  dose_controller.markDosageSlot
);
=======
router.post("/add_dosage", dose_controller.addDosage);
router.get("/all_dosages", dose_controller.getAllDosages);
router.get("/dosage/:id", dose_controller.getDosageById);
router.get("/getDosageOfLogedIn", dose_controller.getDosageOfLogedIn);
router.patch("/update_dosage/:id", dose_controller.updateDosage);
router.delete("/delete_dosage/:id", dose_controller.deleteDosage);
>>>>>>> 0dfcf3c3320df59a6b5792ebe9f8375e1a410158

module.exports = router;
