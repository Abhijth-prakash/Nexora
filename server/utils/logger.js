const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

const logFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const infoTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "../logs/info-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
  format: logFormat,
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "../logs/error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "error",
  format: logFormat,
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    infoTransport,
    errorTransport,
    ...(process.env.NODE_ENV !== "production" ? [consoleTransport] : []),
  ],
});

module.exports = logger;