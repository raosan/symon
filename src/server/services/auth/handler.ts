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

import { Request, Response, NextFunction } from "express";
import { AppError, commonHTTPErrors } from "../../internal/app-error";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import { setupPassport } from "../../config/passport";
import { Repository } from "../users/repository";

const repo = new Repository();

setupPassport(repo);

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    const error = new AppError(
      commonHTTPErrors.badRequest,
      "Bad request, missing mandatory information",
      true,
    );

    next(error);
    return;
  }

  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const uuid = uuidv4();
        const data = {
          result: "SUCCESS",
          message: "string",
          data: {
            accessToken: generateJWT("ACCESS", passportUser.email, uuid),
            refreshToken: generateJWT("REFRESH", passportUser.email, uuid),
          },
        };

        return res.json(data);
      }

      return res.status(401).json(info);
    },
  )(req, res, next);
}

function generateJWT(type: "ACCESS" | "REFRESH", email: string, uuid: string) {
  const today = new Date();
  const jwtSecret = process.env.JWT_SECRET || "jwtSecret";

  return jwt.sign(
    {
      iss: "symon.org",
      sub: email,
      aud: ["OWNER@orgname"], // todo: change this line when role feature is done
      nbf: Math.floor(today.getTime() / 1000),
      iat: Math.floor(today.getTime() / 1000),
      typ: type,
      jit: uuid,
    },
    jwtSecret,
    { expiresIn: type === "ACCESS" ? "5m" : "1y" },
  );
}
