import morgan from "morgan";
import chalk from "chalk";
import { Request, Response } from "express";

export const requestLogger = morgan((tokens, req: Request, res: Response) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const duration = tokens["response-time"](req, res);

  let statusColor = chalk.green;
  if (Number(status) >= 400) statusColor = chalk.red;
  else if (Number(status) >= 300) statusColor = chalk.yellow;

  return [chalk.magenta("[Request]"), chalk.blue(method), chalk.cyan(url), "-", statusColor(status), chalk.dim(`(${duration}ms)`)].join(" ");
});
