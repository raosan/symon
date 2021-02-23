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

import { Project, ProjectCreate, ProjectUpdate } from "./entity";

import Prisma from "../../prisma/prisma-client";

export class ProjectRepository {
  async findMany({
    offset,
    size,
    order,
  }: {
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<Project[]> {
    const data = await Prisma.project.findMany({
      skip: offset,
      take: size,
      orderBy: {
        id: order,
      },
    });

    return data;
  }

  async findOneByID(id: number): Promise<Project | null> {
    const data = await Prisma.project.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async create(res: ProjectCreate): Promise<Project> {
    const data = await Prisma.project.create({
      data: res,
    });

    return data;
  }

  async update(id: number, res: ProjectUpdate): Promise<Project> {
    const data = await Prisma.project.update({
      where: { id },
      data: res,
    });

    return data;
  }

  async destroy(id: number): Promise<number> {
    await Prisma.project.delete({ where: { id } });

    return id;
  }
}
