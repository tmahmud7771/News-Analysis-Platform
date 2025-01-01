const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/register", restrictTo("admin"), authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/me", protect, authController.getMe);

module.exports = router;
