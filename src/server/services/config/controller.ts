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
import { SearchParams } from "./entity";
import { ConfigRepository } from "./repository";

const repo = new ConfigRepository();

export async function findMany(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const params: SearchParams = {
    offset: req.query.offset as string,
    size: req.query.size as string,
    key: req.query.name as string,
    value: req.query.countryCode as string,
    sort: req.query.sort as string,
    order: req.query.order as string,
  };

  try {
    const data = await repo.findMany(params);
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
  const key = req.params.key;

  try {
    const data = await repo.findById(key);

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
  const { key, value } = req.body;

  try {
    const data = await repo.create({
      key,
      value,
    });

    const result = {
      result: "SUCCESS",
      message: `successfully create config with key: ${key}`,
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
  const key = req.params.key;
  const { value } = req.body;

  try {
    const data = await repo.update({
      key,
      value,
    });

    const result = {
      result: "SUCCESS",
      message: `successfully update config with key: ${key}`,
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
  const key = req.params.key;

  try {
    await repo.delete(key);

    const result = {
      result: "SUCCESS",
      message: `successfully deleting ${key}`,
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
