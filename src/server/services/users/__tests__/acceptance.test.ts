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
import user from "../index";
import { User, UserInput, UserUpdate } from "../entity";
import { Repository } from "../repository";
import errorHandler from "../../../internal/middleware/error-handler";

jest.mock("../repository");

let users: User[] = [
  {
    id: 1,
    email: faker.internet.email(),
    password_hash: faker.internet.password(),
    enabled: 1,
    suspended: 0,
    created_at: 1640908800,
    updated_at: 1640908800,
    created_by: faker.internet.exampleEmail(),
    updated_by: faker.internet.exampleEmail(),
  },
];
Repository.prototype.users = async () => {
  return users;
};
Repository.prototype.userByID = async (id: number) => {
  return users.find(user => user.id === id) || null;
};
Repository.prototype.create = async (userInput: UserInput) => {
  const createdUser = { id: 2, ...userInput };
  users.push(createdUser);

  return createdUser;
};
Repository.prototype.update = async (userUpdate: UserUpdate) => {
  const { id, ...newData } = userUpdate;
  users = users.map(user => {
    if (user.id === id) {
      return { ...user, newData };
    }

    return user;
  });
  const updatedData = users.find(user => user.id === id);
  if (!updatedData) {
    throw new Error("User not found");
  }

  return updatedData;
};
Repository.prototype.delete = async (id: number) => {
  users = users.filter(user => user.id !== id);

  return id;
};

describe("User Service", () => {
  // arrange
  const app = express();
  app.use(bodyParser.json());
  app.use(user);
  app.use(errorHandler());

  describe("GET /v1/users", () => {
    it("should return http status code 200", async done => {
      // act
      const res = await request(app).get("/v1/users");

      // assert
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      Repository.prototype.users = async (): Promise<User[]> => {
        throw new Error("query error");
      };

      // act
      const res = await request(app).get("/v1/users");

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("GET /v1/users/:id", () => {
    it("should return http status code 200", async done => {
      // act
      const res = await request(app).get("/v1/users/1");

      // assert
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      done();
    });

    it("should return http status code 404", async done => {
      // act
      const res = await request(app).get("/v1/users/2");

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      Repository.prototype.userByID = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      // act
      const res = await request(app).get("/v1/users/3");

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("POST /v1/users", () => {
    it("should return http status code 201", async done => {
      // act
      const res = await request(app).post("/v1/users").send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      // assert
      expect(res.status).toBe(201);
      expect(users.length).toBe(2);
      done();
    });

    it("should return http status code 400", async done => {
      // act
      const res = await request(app).post("/v1/users").send({
        password: faker.internet.password(),
      });

      // assert
      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      Repository.prototype.create = async (data: UserInput) => {
        throw new Error(`query error with email: ${data.email}`);
      };

      // act
      const res = await request(app).post("/v1/users").send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("PUT /v1/users/:id", () => {
    it("should return http status code 200", async done => {
      // act
      const res = await request(app).put("/v1/users/2").send({
        enabled: 0,
        suspended: 1,
      });

      // assert
      expect(res.status).toBe(200);
      expect(users.length).toBe(2);
      done();
    });

    it("should return http status code 400", async done => {
      // act
      const res = await request(app).put("/v1/users/2").send({
        id: 2,
        enabled: 0,
        suspended: 1,
      });

      // assert
      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      Repository.prototype.update = async (data: UserUpdate) => {
        throw new Error(`query error id: ${data.id}`);
      };

      // act
      const res = await request(app).put("/v1/users/2").send({
        enabled: 0,
        suspended: 1,
      });

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("DELETE /v1/users/:id", () => {
    it("should return http status code 202", async done => {
      // act
      const res = await request(app).delete("/v1/users/2");

      // assert
      expect(res.status).toBe(202);
      expect(users.length).toBe(1);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      Repository.prototype.delete = async (id: number) => {
        throw new Error(`query error id: ${id}`);
      };

      // act
      const res = await request(app).delete("/v1/users/3");

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });
});
