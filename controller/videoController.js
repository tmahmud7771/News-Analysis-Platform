const Video = require("../model/Video");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const logger = require("../utils/logger");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB limit (1024MB)
  },
}).single("video");

exports.uploadVideo = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error(`Upload error: ${err.message}`);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    try {
      console.log("Upload request body:", req.body);
      console.log("Upload file:", req.file);

      if (!req.file) {
        throw new Error("No video file provided");
      }

      // Create full URL for video
      const videoUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;

      const videoData = {
        title: req.body.title,
        description: req.body.description,
        datetime: req.body.datetime,
        videoLink: videoUrl,
        keywords: JSON.parse(req.body.keywords || "[]"),
        relatedPeople: JSON.parse(req.body.relatedPeople || "[]"),
      };

      console.log("Creating video with data:", videoData);

      const video = await Video.create(videoData);
      logger.info(`Video uploaded successfully: ${video._id}`);

      res.status(201).json({
        status: "success",
        data: video,
      });
    } catch (error) {
      logger.error(`Error creating video: ${error.message}`);
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  });
};

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Video file is required",
      });
    }

    // Create full video URL
    const videoUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;

    const videoData = {
      title: req.body.title,
      description: req.body.description,
      videoLink: videoUrl,
      keywords: JSON.parse(req.body.keywords || "[]"),
      relatedPeople: JSON.parse(req.body.relatedPeople || "[]"),
      datetime: req.body.datetime,
    };

    const video = await Video.create(videoData);

    logger.info(`Video uploaded successfully: ${video._id}`);
    res.status(201).json({
      status: "success",
      data: video,
    });
  } catch (error) {
    logger.error(`Error creating video: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const existingVideo = await Video.findById(req.params.id);
    if (!existingVideo) {
      return res.status(404).json({
        status: "error",
        message: "Video not found",
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      datetime: req.body.datetime,
    };

    // Update video file if provided
    if (req.file) {
      updateData.videoLink = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
      // Here you might want to delete the old video file
    }

    // Update arrays if provided
    if (req.body.keywords) {
      updateData.keywords = JSON.parse(req.body.keywords);
    }

    if (req.body.relatedPeople) {
      updateData.relatedPeople = JSON.parse(req.body.relatedPeople);
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`Video updated successfully: ${updatedVideo._id}`);
    res.json({
      status: "success",
      data: updatedVideo,
    });
  } catch (error) {
    logger.error(`Error updating video: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      logger.warn(`Video not found: ${req.params.id}`);
      return res.status(404).json({
        status: "error",
        message: "Video not found",
      });
    }

    // Here you might want to also delete the physical video file
    // fs.unlinkSync(path.join(__dirname, '..', video.videoLink));

    logger.info(`Video deleted successfully: ${video._id}`);
    res.json({
      status: "success",
      data: null,
    });
  } catch (error) {
    logger.error(`Error deleting video: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.searchVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { query, startDate, endDate, people, keywords } = req.query;

    // Build search criteria
    const searchCriteria = {};

    // Text search using regex for fuzzy matching and handling Unicode
    if (query) {
      // Escape special regex characters to prevent regex injection
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedQuery, "iu"); // 'i' for case-insensitive, 'u' for unicode

      searchCriteria.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { keywords: { $elemMatch: { $regex: searchRegex } } }, // Search within array elements
        { "relatedPeople.name": { $regex: searchRegex } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      searchCriteria.datetime = {};
      if (startDate) searchCriteria.datetime.$gte = new Date(startDate);
      if (endDate) searchCriteria.datetime.$lte = new Date(endDate);
    }

    // People filter
    if (people) {
      const peopleIds = people.split(",");
      searchCriteria["relatedPeople.person"] = { $in: peopleIds };
    }

    // Keywords filter - searching within array
    if (keywords) {
      const keywordList = keywords.split(",").map((k) => k.trim());
      searchCriteria.keywords = {
        $in: keywordList.map((k) => new RegExp(k, "iu")),
      };
    }

    // Log the search criteria for debugging
    console.log("Search Criteria:", JSON.stringify(searchCriteria, null, 2));

    // Execute query with pagination
    const [videos, total] = await Promise.all([
      Video.find(searchCriteria)
        .populate("relatedPeople.person", "name occupation img")
        .sort({ datetime: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(), // Add exec() to ensure proper promise resolution

      Video.countDocuments(searchCriteria),
    ]);

    // Log the results for debugging
    console.log(`Found ${total} videos matching criteria`);

    res.json({
      status: "success",
      data: videos,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Search error:", error);
    logger.error(`Search error: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "Error performing search",
      details: error.message,
    });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = Video.find();

    // Populate related people
    query = query.populate({
      path: "relatedPeople.person",
      select: "name occupation img",
    });

    // Add sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-datetime -createdAt");
    }

    // Execute query with pagination
    const videos = await query.skip(skip).limit(limit);

    // Get total count for pagination
    const total = await Video.countDocuments();

    res.json({
      status: "success",
      results: videos.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: videos,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!person) {
      logger.warn(`Video not found with ID: ${req.params.id}`);
      return res.status(404).json({
        status: "error",
        message: "Video not found",
      });
    }

    res.json({
      status: "success",
      data: video,
    });
  } catch (error) {
    logger.error(
      `Error getting video with ID: ${req.params.id} - ${error.message}`
    );
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
