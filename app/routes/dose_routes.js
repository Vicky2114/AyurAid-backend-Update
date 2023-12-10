const express = require("express");
const dose_controller = require("../controllers/dose_controller.js");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJwt.js");

router.post("/add_dosage", authenticateJWT, dose_controller.addDosage);
router.get("/all_dosages", authenticateJWT, dose_controller.getAllDosages);
router.get("/dosage/:id", authenticateJWT, dose_controller.getDosageById);
router.put("/update_dosage/:id", authenticateJWT, dose_controller.updateDosage);
router.delete(
  "/delete_dosage/:id",
  authenticateJWT,
  dose_controller.deleteDosage
);

module.exports = router;
