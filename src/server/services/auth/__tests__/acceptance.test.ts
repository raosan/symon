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

import express from "express";
import bodyParser from "body-parser";
import request from "supertest";
import faker from "faker";
import auth from "../index";
import { User } from "../../users/entity";
import { Repository } from "../../users/repository";
import errorHandler from "../../../internal/middleware/error-handler";
import { setupPassport } from "../../../config/passport";

jest.mock("../../users/repository");

const users: User[] = [
  {
    id: 1,
    email: "foo@bar.com",
    password_hash:
      "$2b$10$mWyxxy0l3SAKl08g6K0W9u0gBzrEDQ757Fgn/gY727t.BYYIvCAhK", //hashed password from: right password
    enabled: 1,
    suspended: 0,
    created_at: 1640908800,
    updated_at: 1640908800,
    created_by: faker.internet.exampleEmail(),
    updated_by: faker.internet.exampleEmail(),
  },
];

Repository.prototype.userByEmail = async (email: string) => {
  return users.find(user => user.email === email) || null;
};

setupPassport(Repository.prototype);

describe("Auth Service", () => {
  // arrange
  const app = express();
  app.use(bodyParser.json());
  app.use(auth);
  app.use(errorHandler());

  describe("POST /v1/auth", () => {
    it("should return http status code 200", async done => {
      // act
      const res = await request(app).post("/v1/auth").send({
        email: "foo@bar.com",
        password: "right password",
      });

      // assert
      expect(res.status).toBe(200);
      done();
    });

    it("should return http status code 400", async done => {
      // act
      const res = await request(app).post("/v1/auth").send({
        email: "foo@bar.com",
        password: "",
      });

      // assert
      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 401 wrong password", async done => {
      // act
      const res = await request(app).post("/v1/auth").send({
        email: "foo@bar.com",
        password: "wrong password",
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });

    it("should return http status code 401 email not found", async done => {
      // act
      const res = await request(app).post("/v1/auth").send({
        email: "foo@foo.com",
        password: "wrong password",
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });
  });
});
