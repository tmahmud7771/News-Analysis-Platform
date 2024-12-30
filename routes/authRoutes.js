const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/me", protect, authController.getMe);

//TESTING

router.get("/users", protect, restrictTo("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = router;
