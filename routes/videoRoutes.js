const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");
const { protect, restrictTo } = require("../middleware/auth");

router.get("/search", videoController.searchVideos);
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideo);
router.post("/", videoController.uploadVideo);
router.patch("/:id", videoController.updateVideo);
router.delete("/:id", videoController.deleteVideo);

module.exports = router;
