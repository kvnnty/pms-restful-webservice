import winston from "winston";

const { combine, timestamp, json, colorize } = winston.format;

const logger = winston.createLogger({
  level: "http",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json(), colorize()),
  transports: [],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export { logger as default };
