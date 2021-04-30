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

import { NextFunction, Request, Response } from "express";

import { AppError, commonHTTPErrors } from "../../internal/app-error";
import { MonikaRepository, ReportRepository } from "./repository";

const monikaRepository = new MonikaRepository();
const reportRepository = new ReportRepository();

export async function createHandshake(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { data: configData, monika } = req.body;

  try {
    const data = await monikaRepository.createHandshake({
      monika,
      config: configData,
    });

    res.status(201).send({
      result: "SUCCESS",
      message: "Successfully create handshake",
      data,
    });
  } catch (err) {
    const error = new AppError(
      commonHTTPErrors.unprocessableEntity,
      err.message,
      true,
    );

    next(error);
  }
}

export async function createReport(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { monika_instance_id, config_version, data: reportData } = req.body;

    const monika = await monikaRepository.findOneByInstanceID(
      monika_instance_id,
    );

    if (!monika) {
      throw new AppError(
        commonHTTPErrors.badRequest,
        "Invalid monika_id",
        true,
      );
    }

    await reportRepository.create({
      monikaId: monika.id,
      monikaInstanceId: monika.instanceId,
      configVersion: config_version,
      data: reportData,
    });

    const isConfigUpdated = monika.version !== config_version;
    const config = JSON.parse(monika?.config ?? "{}");

    res.status(201).send({
      result: isConfigUpdated ? "updated" : "ok",
      message: "Successfully report history",
      ...(isConfigUpdated
        ? {
            data: {
              config_version: monika.version,
              ...config,
            },
          }
        : {}),
    });
  } catch (err) {
    const error =
      err instanceof AppError
        ? err
        : new AppError(commonHTTPErrors.unprocessableEntity, err.message, true);

    next(error);
  }
}
