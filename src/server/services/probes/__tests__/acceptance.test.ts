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

import { probe } from "@prisma/client";
import bodyParser from "body-parser";
import express from "express";
import faker from "faker";
import request from "supertest";

import errorHandler from "../../../internal/middleware/error-handler";
import probeService from "../index";
import { ProbeCreate, ProbeUpdate } from "../entity";
import { Repository } from "../repository";

jest.mock("../repository");

// arrange
let probes: probe[] = [
  {
    id: 1,
    projectID: 1,
    probeName: faker.name.title(),
    status: "STOP",
    runMode: "MANUAL",
    cron: "",
  },
  {
    id: 2,
    projectID: 12,
    probeName: "Test duplicate",
    status: "RUN",
    runMode: "MANUAL",
    cron: "",
  },
];

const mockfindMany = jest.fn();
const mockCount = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDeleteByID = jest.fn();

Repository.prototype.findMany = mockfindMany.mockImplementation(
  async (args?: any): Promise<probe[]> => {
    return probes.filter(probe => probe.projectID === args?.where?.projectID);
  },
);
Repository.prototype.count = mockCount.mockImplementation(
  async (args?: { where: any }): Promise<number> => {
    const total = probes.filter(
      probe =>
        probe.projectID === args?.where?.projectID &&
        probe.probeName === args?.where?.probeName,
    );

    return total.length;
  },
);
Repository.prototype.findById = mockFindById.mockImplementation(
  async (id: number): Promise<probe | null> => {
    const result = probes.find(probe => probe.id === id);

    return result || null;
  },
);
Repository.prototype.create = mockCreate.mockImplementation(
  async (data: ProbeCreate): Promise<probe> => {
    const lastID = probes.reduce((maxID, probe) => {
      if (probe.id > maxID) {
        return probe.id;
      }

      return maxID;
    }, 0);
    const autoIncrementID = lastID + 1;
    const createdProb = { id: autoIncrementID, ...data };
    probes.push(createdProb);

    return createdProb;
  },
);
Repository.prototype.update = mockUpdate.mockImplementation(
  async (data: ProbeUpdate): Promise<probe> => {
    const { id } = data;
    probes = probes.map(probe => {
      if (probe.id === id) {
        return { ...probe, ...data };
      }

      return probe;
    });

    const updatedData = probes.find(probe => probe.id === id);

    if (!updatedData) {
      throw new Error("Project not found");
    }

    return updatedData;
  },
);
Repository.prototype.deleteByID = mockDeleteByID.mockImplementation(
  async (id: number) => {
    probes = probes.filter(probe => probe.id !== id);
  },
);

describe("Probe Service", () => {
  // arrange
  const app = express();
  app.use(bodyParser.json());
  app.use(probeService);
  app.use(errorHandler());

  describe("GET /v1/projects/:id/probes", () => {
    it("should return http status code 200", async done => {
      // act
      const projectID = 1;
      const res = await request(app).get(`/v1/projects/${projectID}/probes`);

      // assert
      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(
        probes.filter(probe => probe.projectID === projectID),
      );

      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      mockfindMany.mockImplementationOnce(
        async (_?: any): Promise<probe[]> => {
          throw new Error("query error");
        },
      );

      // act
      const res = await request(app).get("/v1/projects/1/probes");

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  it("should return http status code 200 with parameters", async done => {
    // act
    const projectID = 1;
    const res = await request(app).get(
      `/v1/projects/${projectID}/probes?offset=10&size=10&order=asc`,
    );

    // assert
    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual(
      probes.filter(probe => probe.projectID === projectID),
    );

    done();
  });

  it("should return http status code 422", async done => {
    // arrange
    mockfindMany.mockImplementationOnce(
      async (_?: any): Promise<probe[]> => {
        throw new Error("query error");
      },
    );

    // act
    const res = await request(app).get("/v1/projects/1/probes");

    // assert
    expect(res.status).toBe(422);
    done();
  });

  describe("POST /v1/projects/:id/probes", () => {
    it("should return http status code 201", async done => {
      // arrange
      const mockData = {
        probeName: faker.name.title(),
      };

      // act
      const res = await request(app)
        .post("/v1/projects/1/probes")
        .send(mockData);

      // assert
      expect(res.status).toEqual(201);
      expect(res.body.data.projectID).toEqual(1);
      expect(res.body.data.status).toEqual("STOP");
      expect(res.body.data.runMode).toEqual("MANUAL");
      expect(res.body.data.cron).toEqual("");

      done();
    });

    it("should return http status code 400", async done => {
      // act
      const res = await request(app).post("/v1/projects/1/probes").send({});

      // assert
      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      Repository.prototype.create = async (
        data: ProbeCreate,
      ): Promise<probe> => {
        throw new Error(`Query error: ${data.probeName}`);
      };

      // act
      const res = await request(app).post("/v1/projects/1/probes").send({
        probeName: faker.name.title(),
      });

      // assert
      expect(res.status).toBe(422);
      done();
    });

    it("should return http status code 409", async done => {
      // act
      const res = await request(app).post("/v1/projects/12/probes").send({
        probeName: "Test duplicate",
      });

      // assert
      expect(res.status).toBe(409);
      done();
    });
  });

  describe("GET /v1/probes/:id", () => {
    it("should return http status code 200", async done => {
      // arrange
      const probeID = 1;

      // act
      const res = await request(app).get(`/v1/probes/${probeID}`);

      // assert
      expect(res.status).toStrictEqual(200);
      expect(res.body.data).toStrictEqual(
        probes.filter(probe => probe.id === probeID)[0],
      );

      done();
    });

    it("should return http status code 404", async done => {
      // arrange
      const probeID = 10;

      // act
      const res = await request(app).get(`/v1/probes/${probeID}`);

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      mockFindById.mockImplementationOnce(async (id: number) => {
        throw new Error(`query error id: ${id}`);
      });

      // act
      const res = await request(app).get("/v1/probes/3");

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("PUT /v1/probes/:id", () => {
    it("should return http status code 200", async done => {
      // arrange
      const probeID = 1;
      const probeName = faker.name.title();

      // act
      const res = await request(app).put(`/v1/probes/${probeID}`).send({
        probeName,
      });

      // assert
      expect(res.status).toBe(200);
      expect(res.body.data).toStrictEqual(
        probes.find(probe => probe.id === probeID),
      );
      done();
    });

    it("should return http status code 404", async done => {
      // arrange
      const probeID = 777;
      const probeName = faker.name.title();

      // act
      const res = await request(app).put(`/v1/probes/${probeID}`).send({
        probeName,
      });

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 400", async done => {
      // arrange
      const probeID = 1;

      // act
      const res = await request(app).put(`/v1/probes/${probeID}`).send({});

      // assert
      expect(res.status).toBe(400);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      const probeID = 1;
      mockUpdate.mockImplementationOnce(async (data: any) => {
        throw new Error(`query error id: ${data?.id}`);
      });

      // act
      const res = await request(app)
        .put(`/v1/probes/${probeID}`)
        .send({ probeName: faker.name.title() });

      // assert
      expect(res.status).toBe(422);
      done();
    });

    it("should return http status code 409", async done => {
      // arrange
      const probeID = 1;
      mockCount.mockReturnValueOnce(1);

      // act
      const res = await request(app)
        .put(`/v1/probes/${probeID}`)
        .send({ probeName: faker.name.title() });

      // assert
      expect(res.status).toBe(409);
      done();
    });
  });

  describe("DELETE /v1/probes/:id", () => {
    it("should return http status code 200", async done => {
      // arrange
      const probeID = 1;

      // act
      const res = await request(app).delete(`/v1/probes/${probeID}`);

      // assert
      expect(res.status).toStrictEqual(200);
      done();
    });

    it("should return http status code 404", async done => {
      // arrange
      const probeID = 100;

      // act
      const res = await request(app).delete(`/v1/probes/${probeID}`);

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      const probeID = 2;
      mockDeleteByID.mockImplementationOnce(async (id: number) => {
        throw new Error(`query error id: ${id}`);
      });

      // act
      const res = await request(app).delete(`/v1/probes/${probeID}`);

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("PUT /v1/probes/:id/start", () => {
    it("should return http status code 200", async done => {
      // arrange
      const probeID = 2;

      // act
      const res = await request(app).put(`/v1/probes/${probeID}/start`);

      // assert
      expect(res.status).toBe(200);
      expect(probes.find(probe => probe.id === probeID)?.status).toEqual("RUN");
      done();
    });

    it("should return http status code 404", async done => {
      // arrange
      const probeID = 700;

      // act
      const res = await request(app).put(`/v1/probes/${probeID}/start`);

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      const probeID = 2;
      mockUpdate.mockImplementationOnce(async (data: any) => {
        throw new Error(`query error id: ${data?.id}`);
      });

      // act
      const res = await request(app).put(`/v1/probes/${probeID}/start`);

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("PUT /v1/probes/:id/stop", () => {
    it("should return http status code 200", async done => {
      // arrange
      const probeID = 2;

      // act
      const res = await request(app).put(`/v1/probes/${probeID}/stop`);

      // assert
      expect(res.status).toBe(200);
      expect(probes.find(probe => probe.id === probeID)?.status).toEqual(
        "STOP",
      );
      done();
    });

    it("should return http status code 404", async done => {
      // arrange
      const probeID = 700;

      // act
      const res = await request(app).put(`/v1/probes/${probeID}/stop`);

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      const probeID = 2;
      mockUpdate.mockImplementationOnce(async (data: any) => {
        throw new Error(`query error id: ${data?.id}`);
      });

      // act
      const res = await request(app).put(`/v1/probes/${probeID}/stop`);

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });

  describe("PUT /v1/probes/:id/schedule", () => {
    it("should return http status code 200", async done => {
      // arrange
      const probeID = 2;
      const cron = "*/10 * * * *";

      // act
      const res = await request(app)
        .put(`/v1/probes/${probeID}/schedule`)
        .send({ cron });

      // assert
      const probeData = probes.find(probe => probe.id === probeID);
      expect(res.status).toBe(200);
      expect(probeData?.cron).toEqual(cron);
      expect(probeData?.runMode).toEqual("CRON");
      done();
    });

    it("should return http status code 404", async done => {
      // arrange
      const probeID = 700;
      const cron = "*/10 * * * *";

      // act
      const res = await request(app)
        .put(`/v1/probes/${probeID}/schedule`)
        .send({ cron });

      // assert
      expect(res.status).toBe(404);
      done();
    });

    it("should return http status code 422", async done => {
      // arrange
      const probeID = 2;
      const cron = "*/10 * * * *";
      mockUpdate.mockImplementationOnce(async (data: any) => {
        throw new Error(`query error id: ${data?.id}`);
      });

      // act
      const res = await request(app)
        .put(`/v1/probes/${probeID}/schedule`)
        .send({ cron });

      // assert
      expect(res.status).toBe(422);
      done();
    });
  });
});
