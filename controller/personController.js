const Person = require("../model/Person");
const Video = require("../model/Video");
const logger = require("../utils/logger");

exports.getAllPersons = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = Person.find();

    // Add sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Execute query with pagination
    const persons = await query.skip(skip).limit(limit);

    // Get total count for pagination
    const total = await Person.countDocuments();

    res.json({
      status: "success",
      results: persons.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: persons,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);

    if (!person) {
      logger.warn(`Person not found with ID: ${req.params.id}`);
      return res.status(404).json({
        status: "error",
        message: "Person not found",
      });
    }

    res.json({
      status: "success",
      data: person,
    });
  } catch (error) {
    logger.error(
      `Error getting person with ID: ${req.params.id} - ${error.message}`
    );
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createPerson = async (req, res) => {
  try {
    const person = await Person.create(req.body);
    logger.info(`Person created with ID: ${person._id}`);
    res.status(201).json({
      status: "success",
      data: person,
    });
  } catch (error) {
    logger.error(`Error creating person: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updatePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!person) {
      logger.warn(`Person not found with ID: ${req.params.id}`);
      return res.status(404).json({
        status: "error",
        message: "Person not found",
      });
    }

    logger.info(`Person updated with ID: ${person._id}`);
    res.json({
      status: "success",
      data: person,
    });
  } catch (error) {
    logger.error(
      `Error updating person with ID: ${req.params.id} - ${error.message}`
    );
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deletePerson = async (req, res) => {
  try {
    // First check if person is referenced in any videos
    const videosWithPerson = await Video.findOne({
      "relatedPeople.person": req.params.id,
    });

    if (videosWithPerson) {
      logger.warn(
        `Cannot delete person with ID: ${req.params.id} - Referenced in videos`
      );
      return res.status(400).json({
        status: "error",
        message: "Cannot delete person: Referenced in videos",
      });
    }

    const person = await Person.findByIdAndDelete(req.params.id);

    if (!person) {
      logger.warn(`Person not found with ID: ${req.params.id}`);
      return res.status(404).json({
        status: "error",
        message: "Person not found",
      });
    }

    logger.info(`Person deleted with ID: ${req.params.id}`);
    res.json({
      status: "success",
      data: null,
    });
  } catch (error) {
    logger.error(
      `Error deleting person with ID: ${req.params.id} - ${error.message}`
    );
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
