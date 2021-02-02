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
import { User, UserInput, UserUpdate } from "./entity";

const prisma = new PrismaClient();

export class Repository {
  async users(): Promise<User[]> {
    const data = await prisma.user.findMany();

    return data;
  }

  async userByID(id: number): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async create(userInput: UserInput): Promise<User> {
    const data = await prisma.user.create({
      data: userInput,
    });

    return data;
  }

  async update(userUpdate: UserUpdate): Promise<User> {
    const { id, ...newData } = userUpdate;
    const data = await prisma.user.update({
      where: { id },
      data: newData,
    });

    return data;
  }

  async delete(id: number): Promise<number> {
    await prisma.user.delete({
      where: { id },
    });

    return id;
  }
}
