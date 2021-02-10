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

import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

import { User, UserCreate, UserUpdate } from "./entity";

const prisma = new PrismaClient();

type UserResponse = Omit<User, "password_hash">;

export class UserRepository {
  private selectedFields = {
    id: true,
    email: true,
    enabled: true,
    suspended: true,
  };

  async findMany({
    offset,
    size,
    order,
  }: {
    offset: number;
    size: number;
    order: "asc" | "desc";
  }): Promise<UserResponse[]> {
    const data = await prisma.user.findMany({
      select: this.selectedFields,
      skip: offset,
      take: size,
      orderBy: {
        id: order,
      },
    });

    return data;
  }

  async findOneByID(id: number): Promise<UserResponse | null> {
    const data = await prisma.user.findUnique({
      select: this.selectedFields,
      where: { id },
    });

    return data;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { email },
    });

    return data;
  }

  async create({ password, ...res }: UserCreate): Promise<UserResponse> {
    const passwordHashed = await this.generatePasswordHash(password);

    const data = await prisma.user.create({
      select: this.selectedFields,
      data: {
        ...res,
        password_hash: passwordHashed,
      },
    });

    return data;
  }

  async update(id: number, res: UserUpdate): Promise<UserResponse> {
    const data = await prisma.user.update({
      select: this.selectedFields,
      where: { id },
      data: res,
    });

    return data;
  }

  async destroy(id: number): Promise<number> {
    await prisma.user.delete({ where: { id } });

    return id;
  }

  async generatePasswordHash(plainTextPassword: string): Promise<string> {
    const saltRounds = 10;
    const passwordHashed = await bcrypt.hash(plainTextPassword, saltRounds);

    return passwordHashed;
  }
}
