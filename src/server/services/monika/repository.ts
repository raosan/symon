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

import { v4 as uuid } from "uuid";
import { Report, ReportCreate, MonikaHandshakeCreate, Monika } from "./entity";
import Prisma from "../../prisma/prisma-client";

export class ReportRepository {
  async findMany(args?: {
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<Report[]> {
    const data = await Prisma.report.findMany({
      take: args?.size,
      skip: args?.offset,
      orderBy: {
        id: args?.order,
      },
      include: { data: true },
    });

    return data;
  }

  async findById(id: number): Promise<Report | null> {
    const result = await Prisma.report.findUnique({
      where: { id },
      include: { data: true },
    });

    return result;
  }

  async create(report: ReportCreate): Promise<Report> {
    const result = await Prisma.report.create({
      data: {
        ...report,
        data: {
          create: report.data,
        },
      },
      include: { data: true, monika: true },
    });

    return result;
  }
}

export class MonikaRepository {
  async createHandshake({
    config,
    ...res
  }: MonikaHandshakeCreate): Promise<{ version: string }> {
    const data = await Prisma.monika.create({
      data: {
        version: uuid(),
        config: JSON.stringify(config),
        instanceId: res.monika.id,
        ipAddress: res.monika.ip_address,
      },
    });

    return {
      version: data.version,
    };
  }

  findOneByInstanceID(id: string): Promise<Monika | null> {
    return Prisma.monika.findFirst({ where: { instanceId: id } });
  }
}
