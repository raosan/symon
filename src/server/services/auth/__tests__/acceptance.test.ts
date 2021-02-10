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

import bodyParser from "body-parser";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";

import { setupPassport } from "../../../config/passport";
import errorHandler from "../../../internal/middleware/error-handler";
import { User } from "../../users/entity";
import { UserRepository } from "../../users/repository";
import auth from "../index";

jest.mock("../../users/repository");

const users: User[] = [
  {
    id: 1,
    email: "foo@bar.com",
    password_hash:
      "$2b$10$mWyxxy0l3SAKl08g6K0W9u0gBzrEDQ757Fgn/gY727t.BYYIvCAhK", //hashed password from: right password
    enabled: 1,
    suspended: 0,
  },
  {
    id: 2,
    email: "disabled@bar.com",
    password_hash:
      "$2b$10$mWyxxy0l3SAKl08g6K0W9u0gBzrEDQ757Fgn/gY727t.BYYIvCAhK", //hashed password from: right password
    enabled: 0,
    suspended: 0,
  },
  {
    id: 3,
    email: "suspended@test.com",
    password_hash:
      "$2b$10$mWyxxy0l3SAKl08g6K0W9u0gBzrEDQ757Fgn/gY727t.BYYIvCAhK", //hashed password from: right password
    enabled: 1,
    suspended: 1,
  },
];

UserRepository.prototype.findOneByEmail = async (email: string) => {
  return users.find(user => user.email === email) || null;
};

setupPassport(UserRepository.prototype);

function generateMockJWT(
  type: "ACCESS" | "REFRESH",
  email: string,
  uuid: string,
  createdAt: number, // added parameter to mock time
) {
  const JWT_SECRET = process.env.JWT_SECRET || "jwtSecret";
  const JWT_ISSUER = process.env.JWT_ISSUER || "symon.org";

  return jwt.sign(
    {
      iss: JWT_ISSUER,
      sub: email,
      aud: ["OWNER@orgname"], // todo: change this line when role feature is done
      nbf: createdAt,
      iat: createdAt,
      typ: type,
      jit: uuid,
    },
    JWT_SECRET,
    { expiresIn: type === "ACCESS" ? "5m" : "1y" },
  );
}

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

  describe("POST /v1/refresh", () => {
    it("should return http status code 200", async done => {
      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockRefreshToken = generateMockJWT(
        "REFRESH",
        "foo@bar.com",
        "randomUUID",
        unixTime,
      );

      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: mockRefreshToken,
      });

      // assert
      expect(res.status).toBe(200);
      done();
    });

    it("should return http status code 400 empty string", async done => {
      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: "",
      });

      // assert
      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 401 empty object", async done => {
      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: {},
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });

    it("should return http status code 401 empty array", async done => {
      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: [],
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });

    it("should return http status code 401 Expired", async done => {
      //arrange
      const now = new Date(2018);
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockRefreshToken = generateMockJWT(
        "REFRESH",
        "foo@bar.com",
        "randomUUID",
        unixTime,
      );

      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: mockRefreshToken,
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });

    it("should return http status code 401 Email not found", async done => {
      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockRefreshToken = generateMockJWT(
        "REFRESH",
        "foo@foo.com",
        "randomUUID",
        unixTime,
      );

      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: mockRefreshToken,
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });

    it("should return http status code 401 User disabled", async done => {
      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockRefreshToken = generateMockJWT(
        "REFRESH",
        "disabled@bar.com",
        "randomUUID",
        unixTime,
      );

      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: mockRefreshToken,
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });

    it("should return http status code 401 User suspended", async done => {
      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockRefreshToken = generateMockJWT(
        "REFRESH",
        "suspended@test.com",
        "randomUUID",
        unixTime,
      );

      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: mockRefreshToken,
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });

    it("should return http status code 401 typ is not REFRESH", async done => {
      //arrange
      const now = new Date();
      const unixTime = Math.floor(now.getTime() / 1000);
      const mockRefreshToken = generateMockJWT(
        "ACCESS",
        "bar@bar.com",
        "randomUUID",
        unixTime,
      );

      // act
      const res = await request(app).post("/v1/refresh").send({
        refreshToken: mockRefreshToken,
      });

      // assert
      expect(res.status).toBe(401);
      done();
    });
  });
});
