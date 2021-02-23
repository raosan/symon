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

import { Location, LocationCreate, LocationUpdate } from "./entity";

import Prisma from "../../prisma/prisma-client";

export class LocationRepository {
  async findMany(offset: number, size: number): Promise<Location[]> {
    const data = await Prisma.location.findMany({
      skip: offset,
      take: size,
    });
    return data;
  }

  async findById(id: number): Promise<Location | null> {
    const data = await Prisma.location.findUnique({
      where: { entityId: id },
    });

    return data;
  }

  async create(locationInput: LocationCreate): Promise<Location> {
    const data = await Prisma.location.create({
      data: locationInput,
    });

    return data;
  }

  async update(locationUpdate: LocationUpdate): Promise<Location> {
    const { entityId, ...newData } = locationUpdate;
    const data = await Prisma.location.update({
      where: { entityId },
      data: newData,
    });
    return data;
  }

  async delete(id: number): Promise<number> {
    await Prisma.location.delete({
      where: { entityId: id },
    });

    return id;
  }
}
