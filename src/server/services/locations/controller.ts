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
import { LocationRepository } from "./repository";

const repo = new LocationRepository();

export async function findMany(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const os = typeof req.query.offset === "string" ? req.query.offset : "0";
  const sz = typeof req.query.size === "string" ? req.query.size : "0";
  const offset: number = parseInt(os, 10);
  const size: number = parseInt(sz, 10);
  try {
    const data = await repo.findMany(offset, size);
    const result = {
      result: "SUCCESS",
      message: "successfully fetch locations",
      data: data,
    };

    res.status(200).send(result);
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );
    next(error);
  }
}

export async function findById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const id = parseInt(req.params.id, 10);

  try {
    const data = await repo.findById(id);

    if (!data) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "Location not found",
        true,
      );

      next(error);

      return;
    }

    const result = {
      result: "SUCCESS",
      message: "location found",
      data: data,
    };

    res.status(200).send(result);
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );
    next(error);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { locationName, countryCode, dataCenter } = req.body;
  const timeNow = Math.floor(Date.now() / 1000);

  try {
    const data = await repo.create({
      locationName,
      countryCode,
      dataCenter,
      createdAt: timeNow,
      updatedAt: timeNow,
      createdBy: "user@email.com", // TODO: to be changed with user credentials when authentication is added
      updatedBy: "user@email.com", // TODO: to be changed with user credentials when authentication is added
    });

    const result = {
      result: "SUCCESS",
      message: "successfully create location",
      data: data,
    };

    res.status(201).send(result);
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );
    next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const { locationName, countryCode, dataCenter } = req.body;
  const timeNow = Math.floor(Date.now() / 1000);

  try {
    const data = await repo.update({
      entityId: id,
      locationName,
      countryCode,
      dataCenter,
      updatedAt: timeNow,
      updatedBy: "user@email.com", // TODO: to be changed with user credentials when authentication is added
    });

    const result = {
      result: "SUCCESS",
      message: "successfully update location",
      data: data,
    };

    res.status(201).send(result);
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );
    next(error);
  }
}

export async function destroy(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const id = parseInt(req.params.id, 10);

  try {
    await repo.delete(id);

    const result = {
      result: "SUCCESS",
      message: "successfully deleting location",
    };

    res.status(200).send(result);
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );
    next(error);
  }
}
