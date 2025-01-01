// routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");
const { protect, restrictTo } = require("../middleware/auth");
const handleMultipartData = require("../middleware/handleMultipartData");

router.get("/search", protect, videoController.searchVideos);
router.get("/", protect, videoController.getAllVideos);
router.get("/:id", protect, videoController.getVideo);
router.post(
  "/",
  protect,
  restrictTo("admin"),
  handleMultipartData,
  videoController.uploadVideo
);
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  handleMultipartData,
  videoController.updateVideo
);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  videoController.deleteVideo
);

module.exports = router;
