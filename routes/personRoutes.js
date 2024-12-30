const express = require("express");
const router = express.Router();
const personController = require("../controller/personController");
const { protect, restrictTo } = require("../middleware/auth");

router.get("/", personController.getAllPersons);
router.post("/", personController.createPerson);
router.get("/:id", personController.getPerson);
router.patch("/:id", personController.updatePerson);
router.delete("/:id", personController.deletePerson);

module.exports = router;
