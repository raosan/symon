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

import { PrismaClient } from "@prisma/client";
import { Organization, OrganizationCreate, OrganizationUpdate } from "./entity";

const prisma = new PrismaClient();

export class OrganizationRepository {
  async findMany({
    offset,
    size,
    order,
  }: {
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<Organization[]> {
    const data = await prisma.organization.findMany({
      skip: offset,
      take: size,
      orderBy: {
        id: order,
      },
    });

    return data;
  }

  async findOneByID(id: number): Promise<Organization | null> {
    const data = await prisma.organization.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async create(res: OrganizationCreate): Promise<Organization> {
    const data = await prisma.organization.create({
      data: res,
    });

    return data;
  }

  async update(id: number, res: OrganizationUpdate): Promise<Organization> {
    const data = await prisma.organization.update({
      where: { id },
      data: res,
    });

    return data;
  }

  async destroy(id: number): Promise<number> {
    await prisma.organization.delete({ where: { id } });

    return id;
  }
}
