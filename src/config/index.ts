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

import dotenv from "dotenv";
import { Algorithm as JWTAlgorithm } from "jsonwebtoken";

dotenv.config();

interface Config {
  env: string;
  port: string;
  jwtSecret: string;
  jwtIssuer: string;
  jwtAccessExpired: string;
  jwtRefreshExpired: string;
  jwtAlgorithm: JWTAlgorithm;
}

declare const process: {
  env: {
    NODE_ENV: string;
    PORT: string;
    JWT_SECRET: string;
    JWT_ACCESS_EXPIRED: string;
    JWT_ISSUER: string;
    JWT_REFRESH_EXPIRED: string;
    JWT_ALGORITHM: JWTAlgorithm;
  };
};

export const cfg: Config = {
  env: process.env.NODE_ENV || "production",
  port: process.env.PORT || "8080",
  jwtSecret: process.env.JWT_SECRET || "jwtSecret",
  jwtIssuer: process.env.JWT_ISSUER || "symon.org",
  jwtAccessExpired: process.env.JWT_ACCESS_EXPIRED || "5m",
  jwtRefreshExpired: process.env.JWT_REFRESH_EXPIRED || "1y",
  jwtAlgorithm: process.env.JWT_ALGORITHM || "HS256",
};
