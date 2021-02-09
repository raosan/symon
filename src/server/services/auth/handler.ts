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
import { cfg } from "../../../config/index";

const JWT_SECRET = cfg.jwtSecret;
const JWT_ISSUER = cfg.jwtIssuer;
const JWT_ACCESS_EXPIRED = cfg.jwtAccessExpired;
const JWT_REFRESH_EXPIRED = cfg.jwtRefreshExpired;

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

    return next(error);
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

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const {
    body: { refreshToken },
  } = req;

  if (!refreshToken) {
    const error = new AppError(
      commonHTTPErrors.badRequest,
      "Bad request, missing mandatory information",
      true,
    );

    return next(error);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(refreshToken, JWT_SECRET); // TODO: create definition for JWT

    const now = new Date();
    const isTokenTypeRefresh = decoded.typ === "REFRESH";
    const isTokenExpired = decoded.exp < Math.floor(now.getTime() / 1000);
    const isTokenValid =
      !isTokenExpired && decoded.iss === JWT_ISSUER && decoded.exp > 0;

    const repo = new Repository();
    const user = await repo.userByEmail(decoded.sub);
    const isUserExistAndActive = user && user.enabled && !user.suspended;

    if (!isTokenTypeRefresh || !isTokenValid || !isUserExistAndActive) {
      throw new Error();
    }

    const data = {
      result: "SUCCESS",
      message: "string",
      data: {
        accessToken: generateJWT("ACCESS", decoded.sub, decoded.uuid),
      },
    };

    res.status(200).send(data);
  } catch {
    const error = new AppError(
      commonHTTPErrors.notAuthenticated,
      "Invalid refresh token",
      true,
    );

    next(error);
  }
}

function generateJWT(type: "ACCESS" | "REFRESH", email: string, uuid: string) {
  const today = new Date();
  const unixTimestampInMilliseconds = today.getTime();
  const millisecondsToSecondsDevider = 1000;
  const unixTimestampInSeconds = Math.floor(
    unixTimestampInMilliseconds / millisecondsToSecondsDevider,
  );

  return jwt.sign(
    {
      iss: JWT_ISSUER,
      sub: email,
      aud: ["OWNER@orgname"], // TODO: change this line when role feature is done
      nbf: unixTimestampInSeconds,
      iat: unixTimestampInSeconds,
      typ: type,
      jit: uuid,
    },
    JWT_SECRET,
    { expiresIn: type === "ACCESS" ? JWT_ACCESS_EXPIRED : JWT_REFRESH_EXPIRED },
  );
}
