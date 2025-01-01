const express = require("express");
const router = express.Router();
const personController = require("../controller/personController");
const { protect, restrictTo } = require("../middleware/auth");

router.get("/", protect, personController.getAllPersons);
router.get("/:id", protect, personController.getPerson);
router.post("/", protect, restrictTo("admin"), personController.createPerson);
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  personController.updatePerson
);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  personController.deletePerson
);

module.exports = router;
