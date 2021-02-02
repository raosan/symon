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
import bcrypt from "bcrypt";
import { AppError, commonHTTPErrors } from "../../internal/app-error";
import { Repository } from "./repository";

export async function index(
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const repo = new Repository();

  try {
    const data = await repo.users();

    res.status(200).send(data);
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );
    next(error);
  }
}

export async function show(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const repo = new Repository();

  try {
    const data = await repo.userByID(parseInt(req.params.id, 10));
    if (!data) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "User not found",
        true,
      );
      next(error);
      return;
    }

    res.status(200).send(data);
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );
    next(error);
  }
}

export async function store(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email, password } = req.body;
  const timeNow = Math.floor(Date.now() / 1000);
  const repo = new Repository();

  try {
    const passwordHash = await generatePasswordHash(password);
    const data = await repo.create({
      email,
      password_hash: passwordHash,
      enabled: 1,
      suspended: 0,
      created_at: timeNow,
      updated_at: timeNow,
      created_by: email,
      updated_by: email,
    });

    res.status(201).send({ id: data.id });
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
  const { id } = req.params;
  const { enabled, suspended } = req.body;
  const timeNow = Math.floor(Date.now() / 1000);
  const repo = new Repository();

  try {
    // update record
    await repo.update({
      id: parseInt(id, 10),
      enabled,
      suspended,
      updated_at: timeNow,
    });

    res.status(200).send({ id });
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
  const { id } = req.params;
  const repo = new Repository();

  try {
    // delete record
    await repo.delete(parseInt(id, 10));

    res.status(202).send();
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );
    next(error);
  }
}

async function generatePasswordHash(
  plainTextPassword: string,
): Promise<string> {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(plainTextPassword, saltRounds);

  return passwordHash;
}
