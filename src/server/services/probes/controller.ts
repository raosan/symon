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
import { Repository } from "./repository";

const repo = new Repository();

export async function index(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { params, query } = req;
  const skip = parseInt((query.offset as string) ?? "0", 10);
  const take = parseInt((query.size as string) ?? "10", 10);
  const order = (query.order as "asc" | "desc") ?? "asc";

  try {
    const data = await repo.findMany({
      skip,
      take,
      orderBy: {
        probeName: order,
      },
      where: {
        projectID: parseInt(params.id, 10),
      },
    });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully get list of probes",
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

export async function show(
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
        "Probe is not found",
        true,
      );

      next(error);
      return;
    }

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully get probe",
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

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { body, params } = req;
  const { probeName } = body;
  const id = parseInt(params.id, 10);

  try {
    // check probe name
    const totalProbe = await repo.count({
      where: {
        projectID: id,
        probeName,
      },
    });
    const isProbeNameUnique = totalProbe === 0;

    if (!isProbeNameUnique) {
      const error = new AppError(
        commonHTTPErrors.conflict,
        "Probe name already exist",
        true,
      );

      next(error);
      return;
    }

    // create probe
    const data = await repo.create({
      projectID: id,
      probeName,
      status: "STOP",
      runMode: "MANUAL",
      cron: "",
    });

    res.status(201).send({
      result: "SUCCESS",
      message: "Successfully create probe",
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

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { body, params } = req;
  const id = parseInt(params.id, 10);
  const { probeName } = body;

  try {
    const probe = await repo.findById(id);

    if (!probe) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "Probe is not found",
        true,
      );

      next(error);
      return;
    }

    // check probe name
    const totalProbe = await repo.count({
      where: {
        projectID: id,
        probeName,
      },
    });
    const isProbeNameUnique = totalProbe === 0;

    if (!isProbeNameUnique) {
      const error = new AppError(
        commonHTTPErrors.conflict,
        "Probe name already exist",
        true,
      );

      next(error);
      return;
    }

    // update probe
    const data = await repo.update({ id, probeName });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully update probe",
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

export async function destroy(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const id = parseInt(req.params.id, 10);

  try {
    const probe = await repo.findById(id);

    if (!probe) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "Probe is not found",
        true,
      );

      next(error);
      return;
    }

    await repo.deleteByID(id);

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully delete probe",
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

export async function start(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { params } = req;
  const id = parseInt(params.id, 10);

  try {
    const probe = await repo.findById(id);

    if (!probe) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "Probe is not found",
        true,
      );

      next(error);
      return;
    }

    // update probe
    await repo.update({ id, status: "RUN" });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully start probe",
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

export async function stop(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { params } = req;
  const id = parseInt(params.id, 10);

  try {
    const probe = await repo.findById(id);

    if (!probe) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "Probe is not found",
        true,
      );

      next(error);
      return;
    }

    // update probe
    await repo.update({ id, status: "STOP" });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully stop probe",
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

export async function schedule(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { body, params } = req;
  const id = parseInt(params.id, 10);
  const { cron } = body;

  try {
    const probe = await repo.findById(id);

    if (!probe) {
      const error = new AppError(
        commonHTTPErrors.notFound,
        "Probe is not found",
        true,
      );

      next(error);
      return;
    }

    // update probe
    await repo.update({ id, cron, runMode: "CRON" });

    res.status(200).send({
      result: "SUCCESS",
      message: "Successfully set probe schedule",
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
