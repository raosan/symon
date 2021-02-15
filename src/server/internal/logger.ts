/**********************************************************************************
 *                                                                                *
 *    Copyright (C) 2021  SYMON Contributors                                      *
 *                                                                                *
 *   This program is free software: you can redistribute it and/or modify         *
 *   it under the terms of the GNU Affero General Public License as published     *
 *   by the Free Software Foundation, either version 3 of the License, or         *
 *   (at your option) any later version.                                          *
 *                                                                                *
 *   This program is distributed in the hope that it will be useful,              *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of               *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                *
 *   GNU Affero General Public License for more details.                          *
 *                                                                                *
 *   You should have received a copy of the GNU Affero General Public License     *
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.       *
 *                                                                                *
 **********************************************************************************/

import winston from "winston";
import expressWinston from "express-winston";
import { cfg } from "../../config";

const transports = [
  new winston.transports.Console({
    level: cfg.env === "production" ? "info" : "debug",
  }),
];

const options: winston.LoggerOptions = {
  transports,
};

export const requestLogger = expressWinston.logger({
  transports,
  format: winston.format.combine(winston.format.json()),
  expressFormat: true,
  colorize: false,
  level: "debug",
});

export const expressErrorLogger = expressWinston.errorLogger({
  transports,
  format: winston.format.combine(winston.format.json()),
  msg:
    "{{err.message}} {{res.statusCode}} {{req.method}} with error: {{err}} and request: {{req}} and response: {{res}}",
});

export const logger = winston.createLogger(options);
logger.debug("  Logging initialized at debug level");
