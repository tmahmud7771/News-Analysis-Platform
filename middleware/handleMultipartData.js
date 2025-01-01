const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4, WebM, and OGG are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
});

const handleMultipartData = (req, res, next) => {
  const uploadSingle = upload.single("video");

  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
    next();
  });
};

module.exports = handleMultipartData;
