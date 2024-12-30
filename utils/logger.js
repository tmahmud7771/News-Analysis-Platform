const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

const fs = require("fs");
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const errorRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "31d", // Keep logs for 31 days
  level: "error",
  format: logFormat,
});

const combinedRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "31d", // Keep logs for 31 days
  format: logFormat,
});

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    errorRotateTransport,
    combinedRotateTransport,
    // Add console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

errorRotateTransport.on("rotate", function (oldFilename, newFilename) {
  logger.info(`Log rotated from ${oldFilename} to ${newFilename}`);
});

combinedRotateTransport.on("rotate", function (oldFilename, newFilename) {
  logger.info(`Log rotated from ${oldFilename} to ${newFilename}`);
});

module.exports = {
  error: (message, meta = {}) => {
    logger.error(message, { meta });
  },
  warn: (message, meta = {}) => {
    logger.warn(message, { meta });
  },
  info: (message, meta = {}) => {
    logger.info(message, { meta });
  },
  debug: (message, meta = {}) => {
    logger.debug(message, { meta });
  },
  stream: {
    write: (message) => {
      logger.info(message.trim());
    },
  },
};
